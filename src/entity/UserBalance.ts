import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
    JoinColumn,
    OneToOne,
} from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { User } from './User';

@ObjectType()
@Entity('tblUserBalance')
export class UserBalance extends BaseEntity {
    @Field(type => ID)
    @PrimaryGeneratedColumn({ name: 'intUserBalanceId' })
    id?: number;

    @Field(type => User)
    @OneToOne(() => User, user => user.userBalance, {
        cascade: false,
        // nullable: false,
    })
    @JoinColumn({
        name: 'intUserId',
    })
    user: User;

    @Field()
    @Column({
        name: 'dblBalance',
        type: 'decimal',
        precision: 16,
        scale: 2,
    })
    balance: number;

    @Field()
    @Column({ name: 'dtmCreated' })
    created: Date;

    @Field()
    @Column({
        name: 'dtmUpdated',
        nullable: true,
    })
    updated?: Date;

    constructor(user: User, balance?: number, dateTime?: Date) {
        super();

        this.user = user;
        this.balance = balance ?? 0;
        this.created = dateTime ?? new Date();
    }
}
