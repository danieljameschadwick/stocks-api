import {
    Entity,
    Column,
    PrimaryGeneratedColumn, BaseEntity, OneToOne, JoinColumn, OneToMany,
} from 'typeorm';
import { Player } from './Player';
import { StockDTO } from '../dto/StockDTO';
import { StockHistory } from './StockHistory';
import { Field, ID, ObjectType } from 'type-graphql';
import { UserStock } from './UserStock';

@ObjectType()
@Entity('tblStock')
export class Stock extends BaseEntity {
    @Field(type => ID)
    @PrimaryGeneratedColumn({ name: 'intStockId' })
    id?: number;

    @Field()
    @Column({ name: 'strAbbreviation' })
    abbreviation: string;

    @Field(type => Player)
    @OneToOne(() => Player, player => player.stock, {
        cascade: false
    })
    @JoinColumn({ name: 'intPlayerId' })
    player: Player;

    @Field(type => [StockHistory])
    @OneToMany(() => StockHistory, stockHistory => stockHistory.stock, {
        cascade: false
    })
    stockHistory: StockHistory[];

    @Field({ nullable: true })
    @Column({
        name: 'dblPrice',
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: true
    })
    price?: number;

    @Field()
    @Column({ name: 'dtmUpdatedDate' })
    updatedDate: Date;

    @Field(type => [UserStock])
    @OneToMany(() => UserStock, stock => stock.stock, {
        cascade: false
    })
    userStocks: UserStock[];

    constructor(abbreviation: string, player: Player, price?: number, updatedDate?: Date) {
        super();

        this.abbreviation = abbreviation;
        this.player = player;
        this.price = price;
        this.updatedDate = updatedDate ?? new Date();
    }

    updateFromDTO(stockDTO: StockDTO) {
        this.abbreviation = stockDTO.abbreviation;

        if (stockDTO.price !== null) {
            this.price = stockDTO.price;
        }

        this.flagUpdated();
    }

    flagUpdated(date?: Date) {
        this.updatedDate = date ?? new Date();
    }
}
