import { AbstractResponse } from '../abstract/AbstractResponse';
import { UserStock } from '../../../entity/UserStock';

export class UserStockSellResponse extends AbstractResponse {
    data: UserStock;
}
