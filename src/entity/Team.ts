import {
    Entity,
    Column,
    Unique,
    OneToMany,
    PrimaryGeneratedColumn, BaseEntity,
} from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { Player } from './Player';

@ObjectType()
@Entity('tblTeam')
@Unique(['name'])
@Unique(['abbreviation'])
export class Team extends BaseEntity {
    @Field((type) => ID)
    @PrimaryGeneratedColumn({ name: 'intTeamId' })
    id?: number;

    @Field()
    @Column({ name: 'strName' })
    name: string;

    @Field()
    @Column({ name: 'strAbbreviation' })
    abbreviation: string;

    @Field((type) => [Player])
    @OneToMany(() => Player, (player) => player.team, {
        cascade: false,
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
