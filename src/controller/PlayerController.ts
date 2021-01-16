import { json, Request, Response } from 'express';
import { Controller, Get, Post, Put, Req, Res, UseBefore } from 'routing-controllers';
import { getManager, Repository } from 'typeorm';
import { Player } from '../entity/Player';
import { Team } from '../entity/Team';
import { TeamRepository } from '../repository/TeamRepository';
import { ORM } from '../enum/Error';

@Controller('/player')
@UseBefore(json())
class PlayerController {
    private playerRepository: Repository<Player>;
    private teamRepository: TeamRepository;

    constructor() {
        this.playerRepository = getManager().getRepository(Player);
        this.teamRepository = getManager().getCustomRepository(TeamRepository);
    }

    @Get('/')
    async all(@Req() request: Request, @Res() response: Response) {
        const players = await this.playerRepository
            .find({
                relations: ['team']
            });

        return response.send({
            message: {},
            data: players
        });
    }

    @Get('/:id')
    async get(@Req() request: Request, @Res() response: Response) {
        const id = request.params.id;
        const player = await this.playerRepository.findOne(id, {
            relations: ['team']
        });

        if (player === undefined) {
            return response.send({
                message: `Player with :id ${id} could not be found.`,
                data: {}
            });
        }

        return response.send({
            message: `Player with name ${player.fullName} [${id}] was found.`,
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

        let player = undefined;

        try {
            player = await this.playerRepository.save(playerModel);
        } catch (error) {
            if (error.code === ORM.DUPLICATED_ENTRY) {
                return response.send({
                    message: `Player with name ${playerModel.fullName} [ - ] already exists.`,
                    data: {},
                });
            }
        }

        if (player === undefined) {
            return response.send({
                message: `Player with name ${playerModel.fullName} [ - ] was not created.`,
                data: player,
            });
        }

        return response.send({
            message: `Player with name ${player.fullName} [${player.id}] created.`,
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

        if (data.team !== null) {
            try {
                team = await this.teamRepository.findOne(data.team.id);
            } catch (error) {
                if (error instanceof NoEntityFound) {
                    return response.send({
                        message: `Team with id [${id}] could not be found.`,
                        data: {},
                    });
                }

                return response.send({
                    message: `Team with id [${id}] suffered an unexpected error..`,
                    data: { error },
                });
            }
        }

        console.log(id);
        console.log(data);
        console.log(team);

        const playerModel = new Player(
            data.firstName,
            data.lastName,
            team
        );

        console.log(playerModel);

        const updateResult = await this.playerRepository.update(id, playerModel);

        if (updateResult.affected < 1) {
            return response.send({
                message: `Player with name ${playerModel.fullName} [${id}] was not updated.`,
                data: {},
            });
        }

        const player = await this.playerRepository.findOne(id);
        return response.send({
            message: `Player with ${player.id} of ${player.fullName} updated.`,
            data: player,
        });
    }
}

export {
    PlayerController
};