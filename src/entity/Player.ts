import { Entity, ObjectIdColumn, Column, ObjectID } from 'typeorm';

@Entity()
export class Player {
    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    getId(): ObjectID {
        return this.id;
    };

    getFullName(): string {
        return `${(this.firstName)} ${(this.lastName)}`;
    };
}
