import { Team } from '../../../entity/Team';
import { AbstractResponse } from '../abstract/AbstractResponse';

export class TeamCreateResponse extends AbstractResponse {
    data: Team;
}
