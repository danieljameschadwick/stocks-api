import { getManager, Repository } from 'typeorm';
import { constants as HttpCodes } from 'http2';
import { UnimplementedMethodResponse } from '../dto/response/UnimplementedMethodResponse';
import { Stock } from '../entity/Stock';
import { UserStockBuyResponse as BuyResponse } from '../dto/response/userStock/UserStockBuyResponse';
import { UserStockSellResponse as SellResponse } from '../dto/response/userStock/UserStockSellResponse';
import { UserStockGetResponse as GetResponse } from '../dto/response/userStock/UserStockGetResponse';
import { UserStockGetAllResponse as GetAllResponse } from '../dto/response/userStock/UserStockGetAllResponse';
import { UserStock } from '../entity/UserStock';
import { UserStockDTO } from '../dto/UserStockDTO';
import { formatStockName } from 'stocks-core/dist/lib/stock';
import { UserBalance } from '../entity/UserBalance';
import { UserRepository } from '../repository/UserRepository';

class UserStockService {
    private userStockRepository: Repository<UserStock>;
    private stockRepository: Repository<Stock>;
    private userRepository: UserRepository;
    private userBalanceRepository: Repository<UserBalance>;

    constructor() {
        this.userStockRepository = getManager().getRepository(UserStock);
        this.stockRepository = getManager().getRepository(Stock);
        this.userRepository = getManager().getCustomRepository(UserRepository);
        this.userBalanceRepository = getManager().getRepository(UserBalance);
    }

    async get(id: number): Promise<GetResponse> {
        const queryBuilder = this.userStockRepository.createQueryBuilder('userStock')
            .innerJoinAndSelect('userStock.user', 'user')
            .innerJoinAndSelect('userStock.stock', 'stock')
            .andWhere('userStock.id = :id', { id })
            .andWhere('userStock.filledPrice IS null')
        ;

        const userStock = await queryBuilder.getOneOrFail();

        if (userStock === undefined) {
            return new GetResponse(
                `UserStock [${id}] not found.`,
                null,
                HttpCodes.HTTP_STATUS_NOT_FOUND
            );
        }

        const { user, stock } = userStock;

        return new GetResponse(
            `UserStock found for User ${user.username} ${stock.abbreviation ? ` for Stock $${stock.abbreviation}.` : `.`}`,
            userStock,
            HttpCodes.HTTP_STATUS_OK
        );
    }

    async getAll(username: string, abbreviation?: string): Promise<GetAllResponse> {
        const user = await this.userRepository.getOneByUsername(username);

        if (user === undefined) {
            return new GetAllResponse(
                'User must be set.',
                null,
                HttpCodes.HTTP_STATUS_BAD_REQUEST
            );
        }

        const queryBuilder = this.userStockRepository.createQueryBuilder('userStock')
            .select(['userStock', 'stock'])
            .leftJoin('userStock.user', 'user')
            .innerJoin('userStock.stock', 'stock')
            .andWhere('user.username = :username', { username: username })
            .andWhere('userStock.filledPrice IS null')
        ;

        if (abbreviation !== undefined) {
            queryBuilder.andWhere('stock.abbreviation = :abbreviation', { abbreviation: abbreviation });
        }

        let userStocks = [];

        try {
            userStocks = await queryBuilder.getMany();
        } catch (error) {
            return new GetAllResponse(
                'UserStocks couldn\'t be found.',
                null,
                HttpCodes.HTTP_STATUS_BAD_REQUEST
            );
        }

        return new GetAllResponse(
            `UserStocks found for User ${username}${abbreviation ? ` for Stock $${abbreviation}.` : `.`}`,
            userStocks,
            HttpCodes.HTTP_STATUS_OK
        );
    }

    async buy(userStockDTO: UserStockDTO): Promise<BuyResponse> {
        const { username, abbreviation, quantity } = userStockDTO;

        const user = await this.userRepository.getOneByUsername(username);
        const stock = await this.stockRepository.findOne({ abbreviation: abbreviation });

        if (
            user === undefined
            || stock === undefined
        ) {
            return new BuyResponse(
                `Couldn't find User [${username}] or Stock [${abbreviation}].`,
                null,
                HttpCodes.HTTP_STATUS_BAD_REQUEST
            );
        }

        if (null === stock.price) {
            return new BuyResponse(
                `No price set on Stock [${abbreviation}].`,
                null,
                HttpCodes.HTTP_STATUS_BAD_REQUEST
            );
        }

        const { userBalance } = user;
        const orderTotal = stock.price * quantity;

        if (userBalance.balance < orderTotal) {
            return new BuyResponse(
                `User ${user.username} [${user.id}] doesn't have enough funds.`,
                null,
                HttpCodes.HTTP_STATUS_BAD_REQUEST
            );
        }

        let userStock = undefined;

        try {
            await getManager().transaction(async transactionalEntityManager => {
                userStock = new UserStock(
                    user,
                    stock,
                    stock.price,
                    quantity,
                );

                userStock = await this.userStockRepository.save(userStock);

                userBalance.balance = userBalance.balance - orderTotal;
                await this.userBalanceRepository.update(userBalance.id, userBalance);
            });
        } catch (error) {
            console.log(error);
            return new BuyResponse(
                `Unknown error whilst saving UserStock ${abbreviation} [${quantity}] for ${username}.`,
                null,
                HttpCodes.HTTP_STATUS_BAD_REQUEST,
            );
        }

        if (userStock === undefined) {
            return new BuyResponse(
                `Unknown error whilst saving UserStock ${abbreviation} [${quantity}] for ${username}.`,
                null,
                HttpCodes.HTTP_STATUS_BAD_REQUEST,
            );
        }

        return new BuyResponse(
            `UserStock: ${user.username} bought ${userStock.quantity} of ${formatStockName(stock.abbreviation)} for $${userStock.boughtPrice} filled.`,
            userStock,
            HttpCodes.HTTP_STATUS_CREATED,
        );
    }

    async sell(id: number, username: string): Promise<SellResponse> {
        let getResponse = undefined;

        try {
            getResponse = await this.get(id);
        } catch (error) {
            console.log(error);
            return new SellResponse(
                `Unknown error whilst retrieving UserStock [${id}].`,
                null,
                HttpCodes.HTTP_STATUS_BAD_REQUEST,
            );
        }

        const userStock = getResponse.data;

        if (
            getResponse.data === undefined
            || getResponse.data === null
        ) {
            return new SellResponse(
                `Couldn't find UserStock [${id}]`,
                null,
                HttpCodes.HTTP_STATUS_NOT_FOUND,
            );
        }

        const { user } = userStock;

        if (user.username !== username) {
            return new SellResponse(
                `Username [${username}] does not match UserStock.`,
                null,
                HttpCodes.HTTP_STATUS_BAD_REQUEST,
            );
        }

        userStock.sell();

        const { userBalance } = user;

        try {
            await getManager().transaction(async transactionalEntityManager => {
                await this.userStockRepository.update(id, userStock);

                userBalance.balance = userBalance.balance + userStock.value();
                await this.userRepository.update(userBalance.id, userBalance);
            });
        } catch (error) {
            return new SellResponse(
                `Unknown error whilst saving UserStock [${id}].`,
                null,
                HttpCodes.HTTP_STATUS_BAD_REQUEST,
            );
        }

        return new SellResponse(
            `UserStock [${userStock.id}] sold at ${userStock.filledPrice}.`,
            userStock,
            HttpCodes.HTTP_STATUS_OK,
        );
    }

    async delete(id: number): Promise<UnimplementedMethodResponse> {
        return new UnimplementedMethodResponse();
    }
}

export default UserStockService;