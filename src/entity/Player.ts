import { Entity, ObjectIdColumn, Column, ObjectID } from 'typeorm';

@Entity()
export class Player {
    @ObjectIdColumn()
    id?: ObjectID;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    price?: number;

    constructor(firstName: string, lastName: string, price?: number) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.price = price;
    }

    getId(): ObjectID | null {
        return this.id;
    };

    getFullName(): string {
        return `${(this.firstName)} ${(this.lastName)}`;
    };

    getPrice(): number | null {
        return this.price;
    }
}
