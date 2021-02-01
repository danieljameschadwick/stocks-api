import { IsNumber, IsString } from 'class-validator';

export class UserStockDTO {
    @IsString()
    username: string;

    @IsString()
    abbreviation: string;

    @IsNumber()
    quantity: number;

    constructor(username: string, abbreviation: string, quantity: number) {
        this.username = username;
        this.abbreviation = abbreviation;
        this.quantity = quantity;
    }
}