import { IsOptional, IsString } from 'class-validator';
import { Team } from '../entity/Team';
import { Stock } from '../entity/Stock';

export class PlayerDTO {
    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsOptional()
    team?: Team;

    @IsOptional()
    stock?: Stock;

    constructor(firstName: string, lastName: string, team?: Team, stock?: Stock) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.team = team;
        this.stock = stock;
    }
}