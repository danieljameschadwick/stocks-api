import { injectable } from 'inversify';
import { EntityRepository, Repository } from 'typeorm';
import { Player } from '../entity/Player';

@injectable()
@EntityRepository(Player)
export class PlayerRepository extends Repository<Player> {}
