import {
    Entity,
    Column,
    Unique,
    PrimaryGeneratedColumn,
    BaseEntity,
    OneToMany,
    OneToOne, JoinColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { UserStock } from './UserStock';
import { UserBalance } from './UserBalance';

@ObjectType()
@Entity('tblUser')
@Unique(['username'])
@Unique(['email'])
export class User extends BaseEntity {
    @Field((type) => ID)
    @PrimaryGeneratedColumn({ name: 'intUserId' })
    id?: number;

    @Field()
    @Column({ name: 'strUsername' })
    username: string;

    @Field()
    @Column({ name: 'strEmail' })
    email: string;

    @Field()
    @Column({ name: 'strPassword' })
    password?: string;

    @Field((type) => UserBalance)
    @OneToOne(() => UserBalance, (userBalance) => userBalance.user, {
        cascade: true,
        nullable: true,
    })
    @JoinColumn({
        name: 'intUserBalanceId',
    })
    userBalance: UserBalance;

    @Field((type) => [UserStock])
    @OneToMany(() => UserStock, (userStock) => userStock.user)
    stocks: UserStock[];

    constructor(username: string, email: string, password?: string) {
        super();

        this.username = username;
        this.email = email;
        this.password = password;
        this.userBalance = new UserBalance(this);
    }

    balance(): number {
        return this.userBalance.balance;
    }
}
