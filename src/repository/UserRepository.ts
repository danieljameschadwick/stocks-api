import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { User } from '../entity/User';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    getBuilder(): SelectQueryBuilder<User>
    {
        return this.createQueryBuilder('user')
            .leftJoinAndSelect('user.stocks', 'stocks')
            .leftJoinAndSelect('user.userBalance', 'balance');
    }

    async getOneByUsername(username: string): Promise<User|undefined>
    {
        return await this.getBuilder()
            .where('user.username = :username', { username })
            .getOne();
    }

}