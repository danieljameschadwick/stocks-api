import {
    Entity,
    Column,
    Unique,
    OneToMany,
    PrimaryGeneratedColumn, BaseEntity,
} from 'typeorm';
import { Player } from './Player';

@Entity()
@Unique(['name', 'abbreviation'])
export class Team extends BaseEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    name: string;

    @Column()
    abbreviation: string;

    @OneToMany(() => Player, player => player.team)
    players: Player[];

    constructor(name: string, abbreviation: string, players?: Player[]) {
        super();

        this.name = name;
        this.abbreviation = abbreviation;

        if (players) {
            // this.players = players;
        }
    }
}
