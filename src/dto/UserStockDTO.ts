import { IsNumber, IsString } from 'class-validator';

export class UserStockDTO {
    @IsString()
    username: string;

    @IsString()
    abbreviation: string;

    @IsNumber()
    quantity: number;

    @IsNumber()
    id?: number;

    constructor(username: string, abbreviation: string, quantity: number, id?: number) {
        this.username = username;
        this.abbreviation = abbreviation;
        this.quantity = quantity;
        this.id = id;
    }
}