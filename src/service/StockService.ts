import { getConnection, getManager, Repository } from 'typeorm';
import { constants as HttpCodes } from 'http2';
import { UnimplementedMethodResponse } from '../dto/response/UnimplementedMethodResponse';
import { Stock } from '../entity/Stock';
import { StockGetAllResponse as GetAllResponse } from '../dto/response/stock/StockGetAllResponse';
import { StockGetResponse as GetResponse } from '../dto/response/stock/StockGetResponse';
import { StockCreateResponse as CreateResponse } from '../dto/response/stock/StockCreateResponse';
import { StockUpdateResponse as UpdateResponse } from '../dto/response/stock/StockUpdateResponse';
import { StockDTO } from '../dto/StockDTO';
import { ORM } from '../enum/Error';
import { StockHistory } from '../entity/StockHistory';

export class StockService {
    private stockRepository: Repository<Stock>;

    constructor() {
        this.stockRepository = getManager().getRepository(Stock);
    }

    async getAll(): Promise<GetAllResponse> {
        let stocks = [];

        try {
            stocks = await this.stockRepository.find();
        } catch (error) {
            return new GetAllResponse(
                'Something went wrong when talking to the ORM.',
                [],
                HttpCodes.HTTP_STATUS_INTERNAL_SERVER_ERROR
            );
        }

        return new GetAllResponse(
            '',
            stocks,
            HttpCodes.HTTP_STATUS_OK
        );
    }

    async get(id: number): Promise<GetResponse> {
        let stock = undefined;

        try {
            stock = await this.stockRepository.createQueryBuilder('stock')
                .addSelect('DATE(dateTime) as date')
                .innerJoinAndSelect('stock.player', 'player')
                .leftJoinAndSelect('stock.stockHistory', 'stockHistory')
                .orderBy({
                    'stockHistory.dateTime': 'ASC',
                })
                .where('stock.id = :id', { id })
                .addGroupBy('date')
                .getOne();
        } catch (error) {
            return new GetResponse(
                `Unknown whilst finding Stock [${id}].`,
                null,
                HttpCodes.HTTP_STATUS_BAD_REQUEST
            );
        }

        if (stock === undefined) {
            return new GetResponse(
                `Stock [${id}] could not found.`,
                null,
                HttpCodes.HTTP_STATUS_NOT_FOUND
            );
        }

        return new GetResponse(
            `Stock ${stock.abbreviation} [${stock.id}] found.`,
            stock,
            HttpCodes.HTTP_STATUS_OK
        );
    }

    async getByAbbreviation(abbreviation: string): Promise<GetResponse> {
        let stock = undefined;

        try {
            stock = await this.stockRepository.createQueryBuilder('stock')
                .addSelect('DATE(dateTime) as date')
                .innerJoinAndSelect('stock.player', 'player')
                .leftJoinAndSelect('player.team', 'team')
                .leftJoinAndSelect('stock.stockHistory', 'stockHistory')
                .orderBy({
                    'stockHistory.dateTime': 'ASC',
                })
                .where('stock.abbreviation = :abbreviation', { abbreviation })
                .addGroupBy('date')
                .getOne();
        } catch (error) {
            return new GetResponse(
                `Unknown whilst finding Stock [${abbreviation}].`,
                null,
                HttpCodes.HTTP_STATUS_BAD_REQUEST
            );
        }

        if (stock === undefined) {
            return new GetResponse(
                `Stock [${abbreviation}] could not found.`,
                null,
                HttpCodes.HTTP_STATUS_NOT_FOUND
            );
        }

        return new GetResponse(
            `Stock ${stock.abbreviation} [${stock.id}] found.`,
            stock,
            HttpCodes.HTTP_STATUS_OK
        );
    }

    async create(stockDTO: StockDTO): Promise<CreateResponse> {
        const stockModel = new Stock(
            stockDTO.abbreviation,
            stockDTO.player,
            stockDTO.price
        );

        let stock = undefined;

        try {
            stock = await this.stockRepository.save(stockModel);
        } catch (error) {
            if (error.code === ORM.DUPLICATED_ENTRY) {
                return new CreateResponse(
                    `Stock ${stockModel.abbreviation} [${stockModel.id}] already exists`,
                    null,
                    HttpCodes.HTTP_STATUS_FOUND
                );
            }

            return new CreateResponse(
                `Unknown error whilst saving Stock ${stockModel.abbreviation}.`,
                null,
                HttpCodes.HTTP_STATUS_BAD_REQUEST
            );
        }

        return new CreateResponse(
            `Stock ${stock.abbreviation} [${stock.id}] created.`,
            null,
            HttpCodes.HTTP_STATUS_CREATED
        );
    }

    async update(id: number, stockDTO: StockDTO, options?: object): Promise<UpdateResponse> {
        let updateResult = undefined;
        let getResult = await this.get(id);
        let stock = getResult.data;

        if (getResult.code !== HttpCodes.HTTP_STATUS_OK) {
            return new UpdateResponse(
                `Could not find Stock [${id}].`,
                getResult,
                HttpCodes.HTTP_STATUS_FOUND
            );
        }

        try {
            updateResult = await getConnection().transaction(async (transactionalEntityManager) => {
                const stockPrice = stock.price;
                const lastUpdated = stock.updatedDate;

                stock.updateFromDTO(stockDTO);

                if (
                    stockDTO.price !== null
                    && stockPrice !== stock.price
                ) {
                    await transactionalEntityManager.save(
                        new StockHistory(stock, stockPrice, lastUpdated)
                    );
                }

                return await transactionalEntityManager.update(Stock, id, stock);
            });
        } catch (error) {
            if (error.code === ORM.DUPLICATED_ENTRY) {
                return new UpdateResponse(
                    `Stock ${stock.abbreviation} already exists. Stock [${id}] wasn't updated.`,
                    null,
                    HttpCodes.HTTP_STATUS_FOUND
                );
            }

            return new UpdateResponse(
                `Unknown error whilst saving Stock ${stock.abbreviation} [${stock.id}].`,
                null,
                HttpCodes.HTTP_STATUS_FOUND
            );
        }

        if (updateResult.affected < 1) {
            return new UpdateResponse(
                `Stock ${stock.abbreviation} [${id}] was not updated.`,
                null,
                HttpCodes.HTTP_STATUS_BAD_REQUEST
            );
        }

        getResult = await this.get(id);
        stock = getResult.data;

        return new UpdateResponse(
            `Stock ${stock.abbreviation} [${stock.id}] updated.`,
            stock,
            HttpCodes.HTTP_STATUS_BAD_REQUEST
        );
    }

    async delete(id: number): Promise<UnimplementedMethodResponse> {
        return new UnimplementedMethodResponse();
    }
}