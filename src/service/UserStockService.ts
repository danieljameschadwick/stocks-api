import { getManager, Repository } from 'typeorm';
import { constants as HttpCodes } from 'http2';
import { UnimplementedMethodResponse } from '../dto/response/UnimplementedMethodResponse';
import { Stock } from '../entity/Stock';
import { UserStockBuyResponse as BuyResponse } from '../dto/response/userStock/UserStockBuyResponse';
import { UserStockSellResponse as SellResponse } from '../dto/response/userStock/UserStockSellResponse';
import { UserStockGetResponse as GetResponse } from '../dto/response/userStock/UserStockGetResponse';
import { UserStockGetAllResponse as GetAllResponse } from '../dto/response/userStock/UserStockGetAllResponse';
import { User } from '../entity/User';
import { UserStock } from '../entity/UserStock';
import { UserStockDTO } from '../dto/UserStockDTO';
import { formatStockName } from 'stocks-core/dist/lib/stock';

class UserStockService {
    private userStockRepository: Repository<UserStock>;
    private stockRepository: Repository<Stock>;
    private userRepository: Repository<User>;

    constructor() {
        this.userStockRepository = getManager().getRepository(UserStock);
        this.stockRepository = getManager().getRepository(Stock);
        this.userRepository = getManager().getRepository(User);
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
        const user = await this.userRepository.findOne({ username: username });

        if (user === undefined) {
            return new GetAllResponse(
                'User must be set.',
                null,
                HttpCodes.HTTP_STATUS_BAD_REQUEST
            );
        }

        const queryBuilder = this.userStockRepository.createQueryBuilder('userStock')
            .innerJoinAndSelect('userStock.user', 'user')
            .innerJoinAndSelect('userStock.stock', 'stock')
            .andWhere('user.username = :username', { username: username })
            .andWhere('userStock.filledPrice IS null')
        ;

        if (abbreviation !== undefined) {
            queryBuilder.andWhere('stock.abbreviation = :abbreviation', { abbreviation: abbreviation });
        }

        const userStocks = await queryBuilder.getMany();

        return new GetAllResponse(
            `UserStocks found for User ${username}${abbreviation ? ` for Stock $${abbreviation}.` : `.`}`,
            userStocks,
            HttpCodes.HTTP_STATUS_OK
        );
    }

    async buy(userStockDTO: UserStockDTO): Promise<BuyResponse> {
        const { username, abbreviation, quantity } = userStockDTO;

        const user = await this.userRepository.findOne({ username: username });
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

        const orderTotal = stock.price * quantity;

        if (user.balance() < orderTotal) {
            return new BuyResponse(
                `User ${user.username} [${user.id}] doesn't have enough funds.`,
                null,
                HttpCodes.HTTP_STATUS_BAD_REQUEST
            );
        }

        let userStock = undefined;

        try {
            userStock = new UserStock(
                user,
                stock,
                stock.price,
                quantity,
            );

            userStock = await this.userStockRepository.save(userStock);
        } catch (error) {
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

        try {
            await this.userStockRepository.update(id, userStock);
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