import { Arg, Query, Resolver } from 'type-graphql';
import { Stock } from '../entity/Stock';
import { getManager, Repository } from 'typeorm';

@Resolver()
export class StockResolver {
    private stockRepository: Repository<Stock>;

    constructor() {
        this.stockRepository = getManager().getRepository(Stock);
    }

    @Query(() => Stock)
    async stock(@Arg('id') id: number) {
        return await this.stockRepository.createQueryBuilder('stock')
            .innerJoinAndSelect('stock.player', 'player')
            .leftJoinAndSelect('stock.stockHistory', 'stockHistory')
            .orderBy({
                'stockHistory.dateTime': 'DESC',
            })
            .where('stock.id = :id', { id })
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