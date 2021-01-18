import {
    Entity,
    Column,
    PrimaryGeneratedColumn, BaseEntity, OneToOne, JoinColumn, OneToMany,
} from 'typeorm';
import { Player } from './Player';
import { StockDTO } from '../dto/StockDTO';
import { StockHistory } from './StockHistory';

@Entity()
export class Stock extends BaseEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    abbreviation: string;

    @OneToOne(() => Player, player => player.stock, {
        cascade: false
    })
    @JoinColumn({ name: 'playerId'})
    player: Player;

    @OneToMany(() => StockHistory, stockHistory => stockHistory.stock, {
        cascade: false
    })
    stockHistory: StockHistory[];

    @Column({
        nullable: true
    })
    price?: number;

    @Column()
    updatedDate: Date;

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
