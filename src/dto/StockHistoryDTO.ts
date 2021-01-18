import { Stock } from '../entity/Stock';
import { IsInt } from 'class-validator';

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