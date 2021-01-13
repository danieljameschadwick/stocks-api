import { Entity, ObjectIdColumn, Column, ObjectID, Unique, ManyToOne } from 'typeorm';
import { Team } from './Team';

@Entity()
@Unique(['firstName', 'lastName'])
export class Player {
    @ObjectIdColumn()
    id?: ObjectID;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @ManyToOne(type => Team, team => team.players)
    team?: Team;

    constructor(firstName: string, lastName: string) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

    getId(): ObjectID | null {
        return this.id;
    };

    getFullName(): string {
        return `${(this.firstName)} ${(this.lastName)}`;
    };
}
