import {
    Entity,
    Column,
    Unique,
    ManyToOne,
    PrimaryGeneratedColumn,
    BaseEntity,
    OneToOne, JoinColumn,
} from 'typeorm';
import { Team } from './Team';
import { Stock } from './Stock';
import { PlayerDTO } from '../dto/PlayerDTO';
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
@Entity()
@Unique(['firstName', 'lastName'])
export class Player extends BaseEntity {
    @Field(type => ID)
    @PrimaryGeneratedColumn()
    id?: number;

    @Field()
    @Column()
    firstName: string;

    @Field()
    @Column()
    lastName: string;

    @Field(type => Team)
    @ManyToOne(() => Team, team => team.players, { nullable: true })
    @JoinColumn({ name: 'teamId' })
    team?: Team;

    @OneToOne(() => Stock, stock => stock.player, {
        cascade: true,
        nullable: true,
    })
    @JoinColumn({ name: 'stockId'})
    stock?: Stock;

    constructor(firstName: string, lastName: string, team?: Team, stock?: Stock) {
        super();

        this.firstName = firstName;
        this.lastName = lastName;
        this.team = team;
        this.stock = stock;
    }

    updateFromDTO(playerDTO: PlayerDTO) {
        this.firstName = playerDTO.firstName;
        this.lastName = playerDTO.lastName;

        if (playerDTO.team !== null) {
            this.team = playerDTO.team;
        }

        if (playerDTO.stock !== null) {
            this.stock = playerDTO.stock;
        }
    }

    get fullName(): string {
        return `${(this.firstName)} ${(this.lastName)}`;
    };
}
