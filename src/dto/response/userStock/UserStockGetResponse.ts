import { AbstractResponse } from '../abstract/AbstractResponse';
import { UserStock } from '../../../entity/UserStock';

export class UserStockGetResponse extends AbstractResponse {
    data: UserStock;
}
