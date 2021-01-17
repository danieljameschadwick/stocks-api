import {
    Entity,
    Column,
    PrimaryGeneratedColumn, BaseEntity, OneToOne, JoinColumn,
} from 'typeorm';
import { Player } from './Player';
import { StockDTO } from '../dto/StockDTO';

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

    @Column()
    price?: number;

    constructor(abbreviation: string, player: Player, price?: number) {
        super();

        this.abbreviation = abbreviation;
        this.player = player;
        this.price = price;
    }

    updateFromDTO(stockDTO: StockDTO) {
        this.abbreviation = stockDTO.abbreviation;

        if (stockDTO.price !== null) {
            this.price = stockDTO.price;
        }
    }
}
