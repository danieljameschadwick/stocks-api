import {
    Entity,
    Column,
    Unique,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Team } from './Team';

@Entity()
@Unique(['firstName', 'lastName'])
export class Player {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @ManyToOne(() => Team, team => team.players)
    team?: Team;

    constructor(firstName: string, lastName: string, team?: Team) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.team = team;
    }

    get fullName(): string {
        return `${(this.firstName)} ${(this.lastName)}`;
    };
}
