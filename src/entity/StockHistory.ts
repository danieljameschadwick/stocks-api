import {
    Entity,
    Column,
    PrimaryGeneratedColumn, BaseEntity, JoinColumn, ManyToOne,
} from 'typeorm';
import { Stock } from './Stock';
import { StockHistoryDTO } from '../dto/StockHistoryDTO';
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
@Entity()
export class StockHistory extends BaseEntity {
    @Field(type => ID)
    @PrimaryGeneratedColumn()
    id?: number;

    @Field(type => Stock)
    @ManyToOne(() => Stock, stock => stock.stockHistory, {
        cascade: false
    })
    @JoinColumn({ name: 'stockId'})
    stock: Stock;

    @Field()
    @Column()
    price: number;

    @Field()
    @Column()
    dateTime: Date;

    constructor(stock: Stock, price: number, dateTime?: Date) {
        super();

        this.stock = stock;
        this.price = price;

        if (dateTime !== null) {
            this.dateTime = dateTime;
        } else {
            this.dateTime = new Date();
        }
    }

    updateFromDTO(stockHistoryDTO: StockHistoryDTO) {
        this.stock = stockHistoryDTO.stock;
        this.price = stockHistoryDTO.price;
        this.dateTime = stockHistoryDTO.dateTime ?? new Date();
    }
}
