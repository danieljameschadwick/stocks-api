import { AbstractResponse } from '../abstract/AbstractResponse';
import { UserStock } from '../../../entity/UserStock';

export class UserStockBuyResponse extends AbstractResponse {
    data: UserStock;
}
