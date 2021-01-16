import { Team } from '../../../entity/Team';
import { AbstractResponse } from '../abstract/AbstractResponse';

export class TeamGetAllResponse extends AbstractResponse {
    data: Team[];
}