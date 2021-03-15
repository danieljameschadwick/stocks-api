import { Stock } from '../entity/Stock';
import { TREND_DIRECTION_HANDLE, TREND_DIRECTION_SYMBOL } from '../enum/Stock';
import { StockHistory } from '../entity/StockHistory';

export class StockFormatter {
    static formatStock(stock: Stock) {
        return {
            ...stock,
            trends: this.formatTrendData(stock, stock.stockHistory[0]),
        };
    }

    static formatTrendData(soonestStock: Stock, latestStock: StockHistory) {
        const trendDirection = this.formatTrendDirection(soonestStock.price, latestStock.price);

        return {
            direction: trendDirection,
            symbol: this.formatTrendSymbol(trendDirection),
            percentage: this.formatPercentage(
                this.calculateStockPercentage(soonestStock.price, latestStock.price),
            ),
        };
    }

    static formatTrendDirection(soonestPrice: number, latestPrice: number): string {
        return soonestPrice > latestPrice
            ? TREND_DIRECTION_HANDLE.UPWARDS
            : TREND_DIRECTION_HANDLE.DOWNWARDS;
    }

    static formatTrendSymbol(trendDirection: string): string {
        return TREND_DIRECTION_SYMBOL[trendDirection];
    }

    static calculateStockPercentage(soonestPrice: number, latestPrice: number): number {
        return ((soonestPrice - latestPrice) / latestPrice) * 100;
    }

    static formatPercentage(percentage: number): number {
        return Math.floor(percentage);
    }
}
