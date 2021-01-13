import { json, Request, Response } from 'express';
import { Controller, Get, Post, Put, Req, Res, UseBefore } from 'routing-controllers';
import { getConnectionManager, Repository } from 'typeorm';
import { Player } from '../entity/Player';
import { Team } from '../entity/Team';

@Controller('/player')
@UseBefore(json())
class PlayerController {
    private playerRepository: Repository<Player>;
    private teamRepository: Repository<Team>;

    constructor() {
        this.playerRepository = getConnectionManager().get().getRepository(Player);
        this.teamRepository = getConnectionManager().get().getRepository(Team);
    }

    @Get('/:id')
    async get(@Req() request: Request, @Res() response: Response) {
        const id = request.params.id;
        const player = await this.playerRepository.findOne(id);

        if (player === undefined) {
            return response.send({
                message: `Player with :id ${id} could not be found.`,
                data: {}
            });
        }

        return response.send({
            message: `Player with name ${player.getFullName()} [${id}] was found..`,
            data: player
        });
    }

    @Post('/')
    async create(@Req() request: Request, @Res() response: Response) {
        const data = request.body;

        if (data === undefined) {
            return response.send({
                message: `No content sent.`,
                data: {},
            });
        }

        const playerModel = new Player(
            data.firstName,
            data.lastName
        );

        const player = await this.playerRepository.save(playerModel);

        if (player === undefined) {
            return response.send({
                message: `Player with name ${playerModel.getFullName()} [ - ] was not created.`,
                data: player,
            });
        }

        return response.send({
            message: `Player with name ${player.getFullName()} [${player.getId()}] created.`,
            data: player,
        });
    }

    @Put('/:id')
    async update(@Req() request: Request, @Res() response: Response) {
        const id = request.params.id;
        const data = request.body;

        if (
            data === undefined
            && id === undefined
        ) {
            return response.send({
                message: `No content sent.`,
                data: {},
            });
        }

        let team = null;

        if (data.team !== undefined) {
            team = await this.teamRepository.findOne(data.team);
        }

        const playerModel = new Player(
            data.firstName,
            data.lastName,
            team
        );

        const updateResult = await this.playerRepository.update(id, playerModel);

        if (updateResult.affected < 1) {
            return response.send({
                message: `Player with name ${playerModel.getFullName()} [${id}] was not updated.`,
                data: {},
            });
        }

        const player = await this.playerRepository.findOne(id);
        return response.send({
            message: `Player with ${player.getId()} of ${player.getFullName()} updated.`,
            data: player,
        });
    }
}

export {
    PlayerController
};