import { json, Request, Response } from 'express';
import { Controller, Get, Post, Put, Req, Res, UseBefore } from 'routing-controllers';
import { getManager, Repository } from 'typeorm';
import { Player } from '../entity/Player';
import { TeamRepository } from '../repository/TeamRepository';
import { PlayerService } from '../service/PlayerService';
import { PlayerDTO } from '../dto/PlayerDTO';
import { TeamService } from '../service/TeamService';
import { PlayerGetResponse } from '../dto/response/player/PlayerGetResponse';
import { constants as HttpCodes } from 'http2';

@Controller('/player')
@UseBefore(json())
class PlayerController {
    private playerService: PlayerService;
    private playerRepository: Repository<Player>;
    private teamService: TeamService;
    private teamRepository: TeamRepository;

    constructor() {
        this.playerService = new PlayerService();
        this.teamService = new TeamService();
        this.playerRepository = getManager().getRepository(Player);
        this.teamRepository = getManager().getCustomRepository(TeamRepository);
    }

    @Get('/')
    async all(@Req() request: Request, @Res() response: Response) {
        return await this.playerService.getAll();
    }

    @Get('/:id')
    async get(@Req() request: Request, @Res() response: Response) {
        const id = parseInt(request.params.id);

        if (id === undefined) {
            return new PlayerGetResponse(
                'Couldn\'t find the ID in the request.',
                {},
                HttpCodes.HTTP_STATUS_BAD_REQUEST
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
                data.lastName
            )
        );
    }

    @Put('/:id')
    async update(@Req() request: Request, @Res() response: Response) {
        const id = parseInt(request.params.id);
        const data = request.body;
        let team = null;

        if (
            data === undefined
            && id === undefined
        ) {
            return response.send({
                message: `No content sent.`,
                data: {},
            });
        }

        if (data.team !== undefined) {
            team = (await this.teamService.get(data.team)).data;
        }

        return await this.playerService.update(
            id,
            new PlayerDTO(
                data.firstName,
                data.lastName,
                team
            )
        );
    }
}

export {
    PlayerController
};