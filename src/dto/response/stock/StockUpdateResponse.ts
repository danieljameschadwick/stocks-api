import { AbstractResponse } from '../abstract/AbstractResponse';
import { Stock } from '../../../entity/Stock';

export class StockUpdateResponse extends AbstractResponse {
    data: Stock;
}
