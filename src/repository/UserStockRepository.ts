import { injectable } from 'inversify';
import { EntityRepository, Repository } from 'typeorm';
import { UserStock } from '../entity/UserStock';

@injectable()
@EntityRepository(UserStock)
export class UserStockRepository extends Repository<UserStock> {}
