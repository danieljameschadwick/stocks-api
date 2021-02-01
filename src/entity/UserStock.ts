import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity, OneToOne, JoinColumn, ManyToOne, OneToMany,
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
    @ManyToOne(() => StockHistory, stockHistory => stockHistory.stock, {
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

    constructor(user: User, stock: Stock, quantity: number, dateTime?: Date) {
        super();

        this.user = user;
        this.stock = stock;
        this.quantity = quantity;

        if (
            stock === undefined
            || stock.price === undefined
        ) {
            throw new Error('Stock is undefined');
        }

        this.boughtPrice = stock.price ?? 0;

        this.dateTime = dateTime ?? new Date();
    }
}
