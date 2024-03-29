import { getManager, Repository } from 'typeorm';
import { constants as HttpCodes } from 'http2';
import { injectable } from 'inversify';
import { Team } from '../entity/Team';
import { TeamGetResponse as GetResponse } from '../dto/response/team/TeamGetResponse';
import { ORM } from '../enum/Error';
import { TeamDTO } from '../dto/TeamDTO';
import { TeamGetAllResponse as GetAllResponse } from '../dto/response/team/TeamGetAllResponse';
import { TeamCreateResponse as CreateResponse } from '../dto/response/team/TeamCreateResponse';
import { TeamUpdateResponse as UpdateResponse } from '../dto/response/team/TeamUpdateResponse';
import { UnimplementedMethodResponse } from '../dto/response/UnimplementedMethodResponse';
import { TeamRepository } from '../repository/TeamRepository';

@injectable()
export class TeamService {
    private teamRepository: TeamRepository;

    constructor() {
        this.teamRepository = getManager().getCustomRepository(TeamRepository);
    }

    async getAll(): Promise<GetAllResponse> {
        let teams = [];

        try {
            teams = await this.teamRepository.find();
        } catch (error) {
            return new GetAllResponse(
                'Something went wrong when talking to the ORM.',
                [],
                HttpCodes.HTTP_STATUS_INTERNAL_SERVER_ERROR,
            );
        }

        return new GetAllResponse(
            '',
            teams,
            HttpCodes.HTTP_STATUS_OK,
        );
    }

    async get(id: number): Promise<GetResponse> {
        let team;

        try {
            team = await this.teamRepository.findOne(id, { relations: ['players'] });
        } catch (error) {
            return new GetResponse(
                `Unknown whilst finding Team [${id}].`,
                null,
                HttpCodes.HTTP_STATUS_BAD_REQUEST,
            );
        }

        if (team === undefined) {
            return new GetResponse(
                `Team [${id}] could not be found.`,
                null,
                HttpCodes.HTTP_STATUS_NOT_FOUND,
            );
        }

        return new GetResponse(
            `Team ${team.name} [${team.id}] found.`,
            team,
            HttpCodes.HTTP_STATUS_OK,
        );
    }

    async create(teamDTO: TeamDTO): Promise<CreateResponse> {
        const teamModel = new Team(
            teamDTO.name,
            teamDTO.abbreviation,
        );

        let team;

        try {
            team = await this.teamRepository.save(teamModel);
        } catch (error) {
            if (error.code === ORM.DUPLICATED_ENTRY) {
                return new CreateResponse(
                    `Team ${teamModel.name}, ${teamModel.abbreviation} already exists.`,
                    null,
                    HttpCodes.HTTP_STATUS_FOUND,
                );
            }

            return new CreateResponse(
                'Unknown error whilst saving Team.',
                null,
                HttpCodes.HTTP_STATUS_BAD_REQUEST,
            );
        }

        return new CreateResponse(
            `Team ${team.name} [${team.id}] created.`,
            null,
            HttpCodes.HTTP_STATUS_CREATED,
        );
    }

    async update(id: number, teamDTO: TeamDTO): Promise<UpdateResponse> {
        let team = (await this.get(id)).data;

        if (team === undefined) {
            return new UpdateResponse(
                `Unknown Team [${id}].`,
                null,
                HttpCodes.HTTP_STATUS_NOT_FOUND,
            );
        }

        const teamModel = new Team(
            teamDTO.name,
            teamDTO.abbreviation,
        );

        let updateResult = null;

        try {
            updateResult = await this.teamRepository.update(id, teamModel);
        } catch (error) {
            if (error.code === ORM.DUPLICATED_ENTRY) {
                return new CreateResponse(
                    `Team ${teamModel.name}, ${teamModel.abbreviation} already exists. Team [${id}] wasn't updated.`,
                    null,
                    HttpCodes.HTTP_STATUS_FOUND,
                );
            }

            return new CreateResponse(
                `Unknown error whilst saving Team ${teamModel.name}.`,
                null,
                HttpCodes.HTTP_STATUS_FOUND,
            );
        }

        if (updateResult.affected < 1) {
            return new UpdateResponse(
                `Team with name ${teamModel.name} [${id}] was not updated.`,
                null,
                HttpCodes.HTTP_STATUS_BAD_REQUEST,
            );
        }

        team = (await this.get(id)).data;

        return new UpdateResponse(
            `Team ${team.name} [${team.id}] updated.`,
            null,
            HttpCodes.HTTP_STATUS_BAD_REQUEST,
        );
    }

    async delete(): Promise<UnimplementedMethodResponse> {
        return new UnimplementedMethodResponse();
    }
}
