import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity, JoinColumn, ManyToOne,
} from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { Stock } from './Stock';
import { User } from './User';
import { StockHistory } from './StockHistory';

@ObjectType()
@Entity()
export class UserStock extends BaseEntity {
    @Field(type => ID)
    @PrimaryGeneratedColumn()
    id?: number;

    @Field(type => User)
    @ManyToOne(() => User, user => user.stocks, {
        cascade: false
    })
    user: User;

    @Field(type => Stock)
    @ManyToOne(() => Stock, stock => stock.userStocks)
    @JoinColumn({ name: 'stockId'})
    stock: Stock;

    @Field()
    @Column()
    quantity: number;

    @Field()
    @Column()
    boughtPrice: number;

    @Field()
    @Column({
        nullable: true
    })
    filledPrice?: number;

    @Field()
    @Column()
    dateTime: Date;

    constructor(user: User, stock: Stock, price: number, quantity: number, dateTime?: Date) {
        super();

        this.user = user;
        this.stock = stock;
        this.boughtPrice = price;
        this.quantity = quantity;

        this.dateTime = dateTime ?? new Date();
    }
}
