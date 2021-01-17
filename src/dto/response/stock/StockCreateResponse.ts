import { AbstractResponse } from '../abstract/AbstractResponse';
import { Stock } from '../../../entity/Stock';

export class StockCreateResponse extends AbstractResponse {
    data: Stock;
}