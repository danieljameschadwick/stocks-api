import { json, Request, Response } from 'express';
import {
    Controller, Delete, Get, Post, Put, Req, Res, UseBefore,
} from 'routing-controllers';
import { injectable } from 'inversify';
import { constants as HttpCodes } from 'http2';
import { TeamService } from '../service/TeamService';
import { TeamGetResponse } from '../dto/response/team/TeamGetResponse';
import { TeamDTO } from '../dto/TeamDTO';
import { UnimplementedMethodResponse } from '../dto/response/UnimplementedMethodResponse';
import { TYPES } from '../di/Types';
import { container } from '../di/Container';

@Controller('/team')
@UseBefore(json())
@injectable()
class TeamController {
    private teamService: TeamService;

    constructor() {
        this.teamService = container.get<TeamService>(TYPES.TeamService);
    }

    @Get('/')
    async all(@Req() request: Request, @Res() response: Response) {
        return await this.teamService.getAll();
    }

    @Get('/:id')
    async get(@Req() request: Request, @Res() response: Response) {
        const id = parseInt(request.params.id, 10);

        if (id === undefined) {
            return new TeamGetResponse(
                'Couldn\'t find the ID in the request.',
                {},
                HttpCodes.HTTP_STATUS_BAD_REQUEST,
            );
        }

        return await this.teamService.get(id);
    }

    @Post('/')
    async create(@Req() request: Request, @Res() response: Response) {
        const data = request.body;

        return await this.teamService.create(
            new TeamDTO(
                data.name,
                data.abbreviation,
            ),
        );
    }

    @Put('/:id')
    async update(@Req() request: Request, @Res() response: Response) {
        const id = parseInt(request.params.id, 10);
        const data = request.body;

        if (
            data === undefined
            && id === undefined
        ) {
            return response.send({
                message: 'No content sent.',
                data: {},
            });
        }

        return await this.teamService.update(
            id,
            new TeamDTO(
                data.name,
                data.abbreviation,
            ),
        );
    }

    @Delete('/:id')
    async delete(): Promise<UnimplementedMethodResponse> {
        return await this.teamService.delete();
    }
}

export default TeamController;
