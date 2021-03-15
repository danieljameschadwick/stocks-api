import { json, Request, Response } from 'express';
import {
    Controller, Delete, Get, Post, Put, Req, Res, UseBefore,
} from 'routing-controllers';
import { constants as HttpCodes } from 'http2';
import { PlayerService } from '../service/PlayerService';
import { PlayerDTO } from '../dto/PlayerDTO';
import { TeamService } from '../service/TeamService';
import { PlayerGetResponse } from '../dto/response/player/PlayerGetResponse';
import { StockService } from '../service/StockService';

@Controller('/player')
@UseBefore(json())
class PlayerController {
    private playerService: PlayerService;

    private teamService: TeamService;

    private stockService: StockService;

    constructor() {
        this.playerService = new PlayerService();
        this.teamService = new TeamService();
        this.stockService = new StockService();
    }

    @Get('/')
    async all(@Req() request: Request, @Res() response: Response) {
        const { ids } = request.body;

        return await this.playerService.getAll(ids);
    }

    @Get('/:id')
    async get(@Req() request: Request, @Res() response: Response) {
        const id = parseInt(request.params.id, 10);

        if (id === undefined) {
            return new PlayerGetResponse(
                'Couldn\'t find the ID in the request.',
                {},
                HttpCodes.HTTP_STATUS_BAD_REQUEST,
            );
        }

        return await this.playerService.get(id);
    }

    @Post('/')
    async create(@Req() request: Request, @Res() response: Response) {
        const data = request.body;

        return await this.playerService.create(
            new PlayerDTO(
                data.firstName,
                data.lastName,
            ),
        );
    }

    @Put('/:id')
    async update(@Req() request: Request, @Res() response: Response) {
        const id = parseInt(request.params.id, 10);
        const data = request.body;
        let team = null;
        let stock = null;

        if (
            data === undefined
            && id === undefined
        ) {
            return response.send({
                message: 'No content sent.',
                data: {},
            });
        }

        if (data.team !== null) {
            team = (await this.teamService.get(data.team.id)).data;
        }

        if (data.stock !== null) {
            stock = (await this.stockService.get(data.stock.id)).data;
        }

        return await this.playerService.update(
            id,
            new PlayerDTO(
                data.firstName,
                data.lastName,
                team,
                stock,
            ),
        );
    }

    @Delete('/:id')
    async delete() {
        return await this.playerService.delete();
    }
}

export default PlayerController;
