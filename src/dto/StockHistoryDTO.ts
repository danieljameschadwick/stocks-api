import { IsInt } from 'class-validator';
import { Stock } from '../entity/Stock';

export class StockHistoryDTO {
    stock: Stock;

    @IsInt()
    price: number;

    dateTime: Date;

    constructor(stock: Stock, price: number, dateTime?: Date) {
        this.stock = stock;
        this.price = price;
        this.dateTime = dateTime ?? new Date();
    }
}
