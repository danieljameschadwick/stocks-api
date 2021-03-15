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
@Entity('tblUserStock')
export class UserStock extends BaseEntity {
    @Field(type => ID)
    @PrimaryGeneratedColumn({ name: 'intUserStockId' })
    id?: number;

    @Field(type => User)
    @ManyToOne(() => User, user => user.stocks, {
        cascade: false,
        nullable: false,
    })
    @JoinColumn({ name: 'intUserId' })

    user: User;

    @Field(type => Stock)
    @ManyToOne(() => Stock, stock => stock.userStocks, {
        cascade: false,
        nullable: false
    })
    @JoinColumn({ name: 'intStockId', })
    stock: Stock;

    @Field()
    @Column({
        name: 'dblQuantity',
        type: 'decimal',
        precision: 10,
        scale: 2,
    })
    quantity: number;

    @Field()
    @Column({
        name: 'dblBoughtPrice',
        type: 'decimal',
        precision: 10,
        scale: 2,
    })
    boughtPrice: number;

    @Field()
    @Column({
        name: 'dblFilledPrice',
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: true,
    })
    filledPrice?: number;

    @Field()
    @Column({ name: 'dtmCreated' })
    dateTime: Date;

    constructor(user: User, stock: Stock, price: number, quantity: number, dateTime?: Date) {
        super();

        this.user = user;
        this.stock = stock;
        this.boughtPrice = price;
        this.quantity = quantity;

        this.dateTime = dateTime ?? new Date();
    }

    sell(): void
    {
        this.filledPrice = this.stock.price;
    }

    isSold(): boolean
    {
        return this.filledPrice !== null;
    }

    value(): number
    {
        if (this.isSold()) {
            return this.filledPrice * this.quantity;
        }

        return this.boughtPrice * this.quantity;
    }
}
