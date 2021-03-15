import { AbstractResponse } from '../abstract/AbstractResponse';
import { Stock } from '../../../entity/Stock';

export class StockGetResponse extends AbstractResponse {
    data?: Stock;
}
