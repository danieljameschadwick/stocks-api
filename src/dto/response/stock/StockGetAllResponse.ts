import { AbstractResponse } from '../abstract/AbstractResponse';
import { Stock } from '../../../entity/Stock';

export class StockGetAllResponse extends AbstractResponse {
    data: Stock[];
}