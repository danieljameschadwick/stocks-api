import { injectable } from 'inversify';
import { EntityRepository, Repository } from 'typeorm';
import { Stock } from '../entity/Stock';

@injectable()
@EntityRepository(Stock)
export class StockRepository extends Repository<Stock> {}
