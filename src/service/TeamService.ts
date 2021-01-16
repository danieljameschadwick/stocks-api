import { getManager, Repository } from 'typeorm';
import { Team } from '../entity/Team';
import { TeamGetResponse as GetResponse } from '../dto/response/team/TeamGetResponse';
import { constants as HttpCodes } from 'http2';
import { ORM } from '../enum/Error';
import { TeamDTO } from '../dto/TeamDTO';
import { TeamGetAllResponse as GetAllResponse } from '../dto/response/team/TeamGetAllResponse';
import { TeamCreateResponse as CreateResponse } from '../dto/response/team/TeamCreateResponse';
import { TeamUpdateResponse as UpdateResponse } from '../dto/response/team/TeamUpdateResponse';
import { UnimplementedMethodResponse } from '../dto/response/UnimplementedMethodResponse';

export class TeamService {
    private teamRepository: Repository<Team>;

    constructor() {
        this.teamRepository = getManager().getRepository(Team);
    }

    async getAll(): Promise<GetAllResponse> {
        let teams = [];

        try {
            teams = await this.teamRepository.find();
        } catch (error) {
            return new GetAllResponse(
                'Something went wrong when talking to the ORM.',
                [],
                HttpCodes.HTTP_STATUS_INTERNAL_SERVER_ERROR
            );
        }

        return new GetAllResponse(
            '',
            teams,
            HttpCodes.HTTP_STATUS_OK
        );
    }

    async get(id: number): Promise<GetResponse> {
        let team = undefined;

        try {
            team = await this.teamRepository.findOne(id, { relations: ['players'] });
        } catch (error) {
            return new GetResponse(
                `Unknown whilst finding Team [${id}].`,
                null,
                HttpCodes.HTTP_STATUS_BAD_REQUEST
            );
        }

        return new GetResponse(
            `Team ${team.name} [${team.id}] found.`,
            team,
            HttpCodes.HTTP_STATUS_OK
        );
    }

    async create(teamDTO: TeamDTO): Promise<CreateResponse> {
        const teamModel = new Team(
            teamDTO.name,
            teamDTO.abbreviation
        );

        let team = undefined;

        try {
            team = await this.teamRepository.save(teamModel);
        } catch (error) {
            if (error.code === ORM.DUPLICATED_ENTRY) {
                return new CreateResponse(
                    `Team ${teamModel.name}, ${teamModel.abbreviation} already exists.`,
                    null,
                    HttpCodes.HTTP_STATUS_FOUND
                );
            }

            return new CreateResponse(
                'Unknown error whilst saving Team.',
                null,
                HttpCodes.HTTP_STATUS_BAD_REQUEST
            );
        }

        return new CreateResponse(
            `Team ${team.name} [${team.id}] created.`,
            null,
            HttpCodes.HTTP_STATUS_CREATED
        );
    }

    async update(id: number, teamDTO: TeamDTO): Promise<UpdateResponse> {
        const teamModel = new Team(
            teamDTO.name,
            teamDTO.abbreviation
        );

        let updateResult = null;

        try {
            updateResult = await this.teamRepository.update(id, teamModel);
        } catch (error) {
            if (error.code === ORM.DUPLICATED_ENTRY) {
                return new CreateResponse(
                    `Team ${teamModel.name}, ${teamModel.abbreviation} already exists. Team [${id}] wasn't updated.`,
                    null,
                    HttpCodes.HTTP_STATUS_FOUND
                );
            }

            return new CreateResponse(
                `Unknown error whilst saving Team ${teamModel.name}.`,
                null,
                HttpCodes.HTTP_STATUS_FOUND
            );
        }

        if (updateResult.affected < 1) {
            return new UpdateResponse(
                `Team with name ${teamModel.name} [${id}] was not updated.`,
                null,
                HttpCodes.HTTP_STATUS_BAD_REQUEST
            );
        }

        const getResponse = await this.get(id);
        const team = getResponse.data;

        return new UpdateResponse(
            `Team ${team.name} [${team.id}] updated.`,
            null,
            HttpCodes.HTTP_STATUS_BAD_REQUEST
        );
    }

    async delete(id: number): Promise<UnimplementedMethodResponse> {
        return new UnimplementedMethodResponse();
    }
}