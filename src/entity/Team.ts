import {
    Entity,
    Column,
    Unique,
    OneToMany,
    PrimaryGeneratedColumn, BaseEntity,
} from 'typeorm';
import { Player } from './Player';
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
@Entity()
@Unique(['name'])
@Unique(['abbreviation'])
export class Team extends BaseEntity {
    @Field(type => ID)
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    name: string;

    @Column()
    abbreviation: string;

    @OneToMany(() => Player, player => player.team, {
        cascade: false
    })
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
