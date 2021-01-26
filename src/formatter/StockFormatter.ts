import { Stock } from '../entity/Stock';
import { TREND_DIRECTION } from '../enum/Stock';
import { StockHistory } from '../entity/StockHistory';

export class StockFormatter {
    static formatStock(stock: Stock) {
        return {
            ...stock,
            trends: {
                direction: this.formatHistoryTrendDirection(stock, stock.stockHistory[0])
            },
        };
    }

    static formatHistoryTrendDirection(soonestStock: Stock, latestStock: StockHistory): string {
        return this.formatTrendDirection(soonestStock.price, latestStock.price);
    }

    static formatTrendDirection(soonestPrice: number, latestPrice: number): string {
        return soonestPrice > latestPrice
            ? TREND_DIRECTION.UPWARDS
            : TREND_DIRECTION.DOWNWARDS
    }
}