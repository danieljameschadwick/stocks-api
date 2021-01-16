import { getManager, Repository } from 'typeorm';
import { Player } from '../entity/Player';
import { PlayerDTO } from '../dto/PlayerDTO';
import { ORM } from '../enum/Error';
import { constants as HttpCodes } from 'http2';
import { Team } from '../entity/Team';
import { PlayerGetResponse as GetResponse } from '../dto/response/player/PlayerGetResponse';
import { PlayerCreateResponse as CreateResponse } from '../dto/response/player/PlayerCreateResponse';
import { PlayerUpdateResponse as UpdateResponse } from '../dto/response/player/PlayerUpdateResponse';
import { PlayerGetAllResponse } from '../dto/response/player/PlayerGetAllResponse';

export class PlayerService {
    private playerRepository: Repository<Player>;
    private teamRepository: Repository<Team>;

    constructor() {
        this.playerRepository = getManager().getRepository(Player);
        this.teamRepository = getManager().getRepository(Team);
    }

    async getAll(): Promise<PlayerGetAllResponse> {
        let players = [];

        try {
            players = await this.playerRepository.find();
        } catch (error) {
            return new PlayerGetAllResponse(
                'Something went wrong when talking to the ORM.',
                [],
                HttpCodes.HTTP_STATUS_INTERNAL_SERVER_ERROR
            );
        }

        return new PlayerGetAllResponse(
            '',
            players,
            HttpCodes.HTTP_STATUS_OK
        );
    }

    async get(id: number): Promise<GetResponse> {
        let player = undefined;

        try {
            player = await this.playerRepository.findOne(id);
        } catch (error) {
            return new GetResponse(
                'Unknown error whilst saving.',
                null,
                HttpCodes.HTTP_STATUS_BAD_REQUEST
            );
        }

        if (player === undefined) {
            return new GetResponse(
                `Player [${id}] could not be found.`,
                null,
                HttpCodes.HTTP_STATUS_NOT_FOUND
            );
        }

        return new GetResponse(
            `Player [${player.id}] found.`,
            player,
            HttpCodes.HTTP_STATUS_OK
        );
    }

    async create(playerDTO: PlayerDTO): Promise<CreateResponse> {
        let player = new Player(
            playerDTO.firstName,
            playerDTO.lastName
        );

        if (playerDTO.team !== null) {
            // player.team = playerDTO.team;
            // this.teamService.get(playerDTO.team);
        }

        try {
            player = await this.playerRepository.save(player);
        } catch (error) {
            if (error.code === ORM.DUPLICATED_ENTRY) {
                return new CreateResponse(
                    'Duplicated user',
                    null,
                    HttpCodes.HTTP_STATUS_FOUND
                );
            }

            return new CreateResponse(
                'Unknown error whilst saving.',
                null,
                HttpCodes.HTTP_STATUS_BAD_REQUEST
            );
        }

        return new CreateResponse(
            `Player [${player.id}] created.`,
            null,
            HttpCodes.HTTP_STATUS_CREATED
        );
    }

    async update(id: number, playerDTO: PlayerDTO): Promise<UpdateResponse> {
        const playerModel = new Player(
            playerDTO.firstName,
            playerDTO.lastName
        );

        const updateResult = await this.playerRepository.update(id, playerModel);

        if (updateResult.affected < 1) {
            return new UpdateResponse(
                `Player with name ${playerModel.fullName} [${id}] was not updated.`,
                null,
                HttpCodes.HTTP_STATUS_BAD_REQUEST
            );
        }

        const getResponse = await this.get(id);
        const player = getResponse.data;

        return new UpdateResponse(
            `Player with ${player.id} of ${player.fullName} updated.`,
            null,
            HttpCodes.HTTP_STATUS_BAD_REQUEST
        );
    }

    disable() {

    }
}