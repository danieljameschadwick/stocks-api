import { IsInt, IsOptional } from 'class-validator';
import { Player } from '../entity/Player';

export class StockDTO {
    @IsInt()
    abbreviation: string;

    player: Player;

    @IsOptional()
    @IsInt()
    price?: number;

    constructor(abbreviation: string, player: Player, price?: number) {
        this.abbreviation = abbreviation;
        this.player = player;
        this.price = price;
    }
}