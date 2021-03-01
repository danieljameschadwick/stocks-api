import { AbstractResponse } from '../abstract/AbstractResponse';
import { UserStock } from '../../../entity/UserStock';

export class UserStockGetAllResponse extends AbstractResponse {
    data: UserStock[];
}