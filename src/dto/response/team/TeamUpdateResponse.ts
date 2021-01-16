import { Team } from '../../../entity/Team';
import { AbstractResponse } from '../abstract/AbstractResponse';

export class TeamUpdateResponse extends AbstractResponse {
    data: Team;
}