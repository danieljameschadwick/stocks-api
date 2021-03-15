import { IsString } from 'class-validator';

export class TeamDTO {
    @IsString()
    name: string;

    @IsString()
    abbreviation: string;

    constructor(name: string, abbreviation: string) {
        this.name = name;
        this.abbreviation = abbreviation;
    }
}
