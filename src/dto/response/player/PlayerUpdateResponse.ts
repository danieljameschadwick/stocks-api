import { Player } from '../../../entity/Player';
import { AbstractResponse } from '../abstract/AbstractResponse';

export class PlayerUpdateResponse extends AbstractResponse {
    data: Player;
}