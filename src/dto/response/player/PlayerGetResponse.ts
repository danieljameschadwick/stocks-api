import { Player } from '../../../entity/Player';
import { AbstractResponse } from '../abstract/AbstractResponse';

export class PlayerGetResponse extends AbstractResponse {
    data: Player;
}