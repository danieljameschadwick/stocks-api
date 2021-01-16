import { getManager, Repository } from 'typeorm';
import { Team } from '../entity/Team';
import { TeamGetResponse as GetResponse } from '../dto/response/team/TeamGetResponse';
import { constants as HttpCodes } from 'http2';

export class TeamService {
    private teamRepository: Repository<Team>;

    constructor() {
        this.teamRepository = getManager().getRepository(Team);
    }

    create() {

    }

    async get(id: number): Promise<GetResponse> {
        let team = undefined;

        try {
            team = await this.teamRepository.findOne(id);
        } catch (error) {
            return new GetResponse(
                'Unknown error whilst saving.',
                null,
                HttpCodes.HTTP_STATUS_BAD_REQUEST
            );
        }

        return new GetResponse(
            `Team [${team.id}] found.`,
            team,
            HttpCodes.HTTP_STATUS_OK
        );
    }

    disable() {

    }
}