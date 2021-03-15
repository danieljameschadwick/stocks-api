import { Arg, Query, Resolver } from 'type-graphql';
import { getManager, Repository } from 'typeorm';
import { Stock } from '../entity/Stock';

@Resolver()
export class StockResolver {
    private stockRepository: Repository<Stock>;

    constructor() {
        this.stockRepository = getManager().getRepository(Stock);
    }

    @Query(() => Stock)
    async stock(@Arg('id') id: number) {
        return await this.stockRepository.createQueryBuilder('stock')
            .addSelect('DATE(dateTime) as date')
            .innerJoinAndSelect('stock.player', 'player')
            .leftJoinAndSelect('stock.stockHistory', 'stockHistory')
            .orderBy({
                'stockHistory.dateTime': 'ASC',
            })
            .where('stock.id = :id', { id })
            .addGroupBy('date')
            .getOne();
    }

    @Query(() => [Stock])
    async stocks() {
        return await this.stockRepository.createQueryBuilder('stock')
            .innerJoinAndSelect('stock.player', 'player')
            .leftJoinAndSelect('stock.stockHistory', 'stockHistory')
            .orderBy({
                'stockHistory.dateTime': 'DESC',
            })
            .getMany();
    }
}
