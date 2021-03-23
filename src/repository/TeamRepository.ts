import { injectable } from 'inversify';
import { EntityRepository, Repository } from 'typeorm';
import { Team } from '../entity/Team';

@injectable()
@EntityRepository(Team)
export class TeamRepository extends Repository<Team> {}
