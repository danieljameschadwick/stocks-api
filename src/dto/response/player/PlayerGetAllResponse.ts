import { Player } from '../../../entity/Player';
import { AbstractResponse } from '../abstract/AbstractResponse';

export class PlayerGetAllResponse extends AbstractResponse {
    data: Player[];
}
