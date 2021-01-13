import { Entity, ObjectIdColumn, Column, ObjectID, Unique, OneToMany } from 'typeorm';
import { Player } from './Player';

@Entity()
@Unique(['name', 'abbreviation'])
export class Team {
    @ObjectIdColumn()
    id?: ObjectID;

    @Column()
    name: string;

    @Column()
    abbreviation: string;

    @OneToMany(type => Player, player => player.team)
    players: Player[];

    constructor(name: string, abbreviation: string) {
        this.name = name;
        this.abbreviation = abbreviation;
    }

    getId(): ObjectID | null {
        return this.id;
    };

    getName(): string {
        return this.name;
    };
}
