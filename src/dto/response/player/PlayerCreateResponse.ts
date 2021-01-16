import { Player } from '../../../entity/Player';
import { AbstractResponse } from '../abstract/AbstractResponse';

export class PlayerCreateResponse extends AbstractResponse {
    data: Player;
}