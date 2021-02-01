import {
    Entity,
    Column,
    Unique,
    PrimaryGeneratedColumn,
    BaseEntity, ManyToOne, OneToMany,
} from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { UserStock } from './UserStock';
import { StockHistory } from './StockHistory';

@ObjectType()
@Entity()
@Unique(['username'])
@Unique(['email'])
export class User extends BaseEntity {
    @Field(type => ID)
    @PrimaryGeneratedColumn()
    id?: number;

    @Field()
    @Column()
    username: string;

    @Field()
    @Column()
    email: string;

    @Field()
    @Column()
    password?: string;

    @Field(type => [UserStock])
    @OneToMany(() => UserStock, userStock => userStock.user)
    stocks: UserStock[];

    constructor(username: string, email: string, password?: string) {
        super();

        this.username = username;
        this.email = email;
        this.password = password;
    }
}
