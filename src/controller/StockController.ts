import { json, Request, Response } from 'express';
import { Controller, Delete, Get, Post, Put, Req, Res, UseBefore } from 'routing-controllers';
import { constants as HttpCodes } from 'http2';
import { StockService } from '../service/StockService';
import { StockGetResponse } from '../dto/response/stock/StockGetResponse';
import { StockDTO } from '../dto/StockDTO';
import { PlayerService } from '../service/PlayerService';
import { StockFormatter } from '../formatter/StockFormatter';

@Controller('/stock')
@UseBefore(json())
class StockController {
    private stockService: StockService;
    private playerService: PlayerService;

    constructor() {
        this.stockService = new StockService();
        this.playerService = new PlayerService();
    }

    @Get('/')
    async all(@Req() request: Request, @Res() response: Response) {
        return await this.stockService.getAll();
    }

    @Get('/:id')
    async get(@Req() request: Request, @Res() response: Response) {
        const id = parseInt(request.params.id);

        if (id === undefined) {
            return new StockGetResponse(
                'Couldn\'t find the ID in the request.',
                null,
                HttpCodes.HTTP_STATUS_BAD_REQUEST
            );
        }

        return await this.stockService.get(id);
    }

    @Get('/abbreviation/:abbreviation')
    async getByAbbreviation(@Req() request: Request, @Res() response: Response) {
        const abbreviation = request.params.abbreviation;

        if (abbreviation === undefined) {
            return new StockGetResponse(
                'Couldn\'t find the abbreviation in the request.',
                null,
                HttpCodes.HTTP_STATUS_BAD_REQUEST
            );
        }

        const getResponse = await this.stockService.getByAbbreviation(abbreviation);

        return StockFormatter.formatStock(getResponse.data);
    }

    @Post('/')
    async create(@Req() request: Request, @Res() response: Response) {
        const data = request.body;

        return await this.stockService.create(
            new StockDTO(
                data.abbreviation,
                data.player
            )
        );
    }

    @Put('/:id')
    async update(@Req() request: Request, @Res() response: Response) {
        const id = parseInt(request.params.id);
        const data = request.body;
        let player = null;

        if (
            data === undefined
            && id === undefined
        ) {
            return response.send({
                message: `No content sent.`,
                data: null,
            });
        }

        if (data.player !== null) {
            player = (await this.playerService.get(data.player.id)).data;
        }

        return await this.stockService.update(
            id,
            new StockDTO(
                data.abbreviation,
                player,
                data.price
            )
        );
    }

    @Delete('/:id')
    async delete(@Req() request, @Res() response) {
        const id = parseInt(request.params.id);

        return await this.stockService.delete(id);
    }
}

export default StockController;