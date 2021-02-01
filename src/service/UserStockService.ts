import { getManager, Repository } from 'typeorm';
import { constants as HttpCodes } from 'http2';
import { UnimplementedMethodResponse } from '../dto/response/UnimplementedMethodResponse';
import { Stock } from '../entity/Stock';
import { UserStockBuyResponse as BuyResponse } from '../dto/response/userStock/UserStockBuyResponse';
import { User } from '../entity/User';
import { UserStock } from '../entity/UserStock';
import { UserStockDTO } from '../dto/UserStockDTO';

export class UserStockService {
    private userStockRepository: Repository<UserStock>;
    private stockRepository: Repository<Stock>;
    private userRepository: Repository<User>;

    constructor() {
        this.userStockRepository = getManager().getRepository(UserStock);
        this.stockRepository = getManager().getRepository(Stock);
        this.userRepository = getManager().getRepository(User);
    }

    async get(id: number) {
        return new UnimplementedMethodResponse();
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

        console.log({ user, stock })

        if (null === stock.price) {
            return new BuyResponse(
                `No price set on Stock [${abbreviation}].`,
                null,
                HttpCodes.HTTP_STATUS_BAD_REQUEST
            );
        }

        try {
            let userStock = new UserStock(
                user,
                stock,
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

        return new BuyResponse(
            `UserStock $${userStock.stock.abbreviation}, ${userStock.quantity} [${userStock.filledPrice}] for ${userStock.user.username} created.`,
            userStock,
            HttpCodes.HTTP_STATUS_CREATED,
        );
    }

    async sell(userStock: UserStock, user: User) {

    }

    async delete(id: number): Promise<UnimplementedMethodResponse> {
        return new UnimplementedMethodResponse();
    }
}