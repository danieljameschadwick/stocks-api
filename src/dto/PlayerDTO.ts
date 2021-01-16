import { IsOptional, IsString } from 'class-validator';
import { Team } from '../entity/Team';

export class PlayerDTO {
    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsOptional()
    team?: Team;

    constructor(firstName: string, lastName: string, team?: Team) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.team = team;
    }
}