import { EntityRepository, Repository } from 'typeorm';
import { Team } from '../entity/Team';

@EntityRepository(Team)
export class TeamRepository extends Repository<Team> {}