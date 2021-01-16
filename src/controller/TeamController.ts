import { json, Request, Response } from 'express';
import { Controller, Get, Post, Put, Req, Res, UseBefore } from 'routing-controllers';
import { getManager, Repository } from 'typeorm';
import { Team } from '../entity/Team';
import { ORM } from '../enum/Error';

@Controller('/team')
@UseBefore(json())
class TeamController {
    private teamRepository: Repository<Team>;

    constructor() {
        this.teamRepository = getManager().getRepository(Team);
    }

    @Get('/')
    async all(@Req() request: Request, @Res() response: Response) {
        const teams = await this.teamRepository.find();

        return response.send({
            message: {},
            data: teams
        });
    }

    @Get('/:id')
    async get(@Req() request: Request, @Res() response: Response) {
        const id = request.params.id;
        const team = await this.teamRepository.findOne(id, { relations: ['players'] });

        if (team === undefined) {
            return response.send({
                message: `Team with :id ${id} could not be found.`,
                data: {}
            });
        }

        return response.send({
            message: `Team with name ${team.name} [${id}] was found.`,
            data: team
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

        const teamModel = new Team(
            data.name,
            data.abbreviation
        );

        let team = undefined;

        try {
            team = await this.teamRepository.save(teamModel);
        } catch (error) {
            if (error.code === ORM.DUPLICATED_ENTRY) {
                return response.send({
                    message: `Team with name ${teamModel.name} [ - ] already exists.`,
                    data: {},
                });
            }
        }

        if (team === undefined) {
            return response.send({
                message: `Team with name ${teamModel.name} [ - ] was not created.`,
                data: team,
            });
        }

        return response.send({
            message: `Team with name ${team.name} [${team.id}] created.`,
            data: team,
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

        if (await this.teamRepository.findOne(id) === undefined) {
            return response.send({
                message: `Team with id [${id}] could not be found.`,
                data: {},
            });
        }

        const updateResult = await this.teamRepository.update(id, { name: data.name, abbreviation: data.abbreviation });

        if (updateResult.affected < 1) {
            return response.send({
                message: `Team with name ${data.name} [${id}] was not updated.`,
                data: {},
            });
        }

        const team = await this.teamRepository.findOne(id);
        return response.send({
            message: `Team with name ${team.name} [${team.id}] updated.`,
            data: team,
        });
    }
}

export {
    TeamController
};