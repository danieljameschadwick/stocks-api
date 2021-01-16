import { Team } from '../../../entity/Team';
import { AbstractResponse } from '../abstract/AbstractResponse';

export class TeamGetResponse extends AbstractResponse {
    data: Team;
}