import { getManager, In, Repository } from 'typeorm';
import { constants as HttpCodes } from 'http2';
import { injectable } from 'inversify';
import { Player } from '../entity/Player';
import { PlayerDTO } from '../dto/PlayerDTO';
import { ORM } from '../enum/Error';
import { PlayerGetResponse as GetResponse } from '../dto/response/player/PlayerGetResponse';
import { PlayerCreateResponse as CreateResponse } from '../dto/response/player/PlayerCreateResponse';
import { PlayerUpdateResponse as UpdateResponse } from '../dto/response/player/PlayerUpdateResponse';
import { PlayerGetAllResponse } from '../dto/response/player/PlayerGetAllResponse';
import { UnimplementedMethodResponse } from '../dto/response/UnimplementedMethodResponse';
import { PlayerRepository } from '../repository/PlayerRepository';

@injectable()
export class PlayerService {
    private playerRepository: PlayerRepository;

    constructor() {
        this.playerRepository = getManager().getCustomRepository(PlayerRepository);
    }

    async getAll(ids?: number[]): Promise<PlayerGetAllResponse> {
        let players = [];
        let options = {};

        if (
            ids !== undefined
            && ids.length > 0
        ) {
            options = {
                id: In(ids),
            };
        }

        try {
            players = await this.playerRepository.find(options);
        } catch (error) {
            return new PlayerGetAllResponse(
                'Something went wrong when talking to the ORM.',
                [],
                HttpCodes.HTTP_STATUS_INTERNAL_SERVER_ERROR,
            );
        }

        return new PlayerGetAllResponse(
            '',
            players,
            HttpCodes.HTTP_STATUS_OK,
        );
    }

    async get(id: number): Promise<GetResponse> {
        let player;

        try {
            player = await this.playerRepository.findOne(id, {
                relations: ['team', 'stock'],
            });
        } catch (error) {
            return new GetResponse(
                `Error finding Player [${id}].`,
                null,
                HttpCodes.HTTP_STATUS_BAD_REQUEST,
            );
        }

        if (player === undefined) {
            return new GetResponse(
                `Player [${id}] could not be found.`,
                null,
                HttpCodes.HTTP_STATUS_NOT_FOUND,
            );
        }

        return new GetResponse(
            `Player [${player.id}] found.`,
            player,
            HttpCodes.HTTP_STATUS_OK,
        );
    }

    async create(playerDTO: PlayerDTO): Promise<CreateResponse> {
        const playerModel = new Player(
            playerDTO.firstName,
            playerDTO.lastName,
        );

        if (playerDTO.team !== null) {
        // player.team = playerDTO.team;
        // this.teamService.get(playerDTO.team);
        }

        let player;

        try {
            player = await this.playerRepository.save(playerModel);
        } catch (error) {
            if (error.code === ORM.DUPLICATED_ENTRY) {
                return new CreateResponse(
                    `Player ${playerModel.fullName} already exists`,
                    null,
                    HttpCodes.HTTP_STATUS_FOUND,
                );
            }

            return new CreateResponse(
                `Unknown error whilst saving Player ${playerModel.fullName}.`,
                null,
                HttpCodes.HTTP_STATUS_BAD_REQUEST,
            );
        }

        return new CreateResponse(
            `Player [${player.id}] created.`,
            null,
            HttpCodes.HTTP_STATUS_CREATED,
        );
    }

    async update(id: number, playerDTO: PlayerDTO): Promise<UpdateResponse> {
        let updateResult;
        const getResult = await this.get(id);
        let player = getResult.data;

        if (getResult.code !== HttpCodes.HTTP_STATUS_OK) {
            return new UpdateResponse(
                `Could not find Player ${id}.`,
                getResult,
                HttpCodes.HTTP_STATUS_FOUND,
            );
        }

        player.updateFromDTO(playerDTO);

        try {
            updateResult = await this.playerRepository.update(id, player);
        } catch (error) {
            if (error.code === ORM.DUPLICATED_ENTRY) {
                return new UpdateResponse(
                    `Player ${player.fullName} already exists. Player [${id}] wasn't updated.`,
                    null,
                    HttpCodes.HTTP_STATUS_FOUND,
                );
            }

            return new UpdateResponse(
                `Unknown error whilst saving Player ${player.fullName}.`,
                null,
                HttpCodes.HTTP_STATUS_FOUND,
            );
        }

        if (updateResult.affected < 1) {
            return new UpdateResponse(
                `Player with name ${player.fullName} [${id}] was not updated.`,
                null,
                HttpCodes.HTTP_STATUS_BAD_REQUEST,
            );
        }

        const getResponse = await this.get(id);
        player = getResponse.data;

        return new UpdateResponse(
            `Player with ${player.id} of ${player.fullName} updated.`,
            player,
            HttpCodes.HTTP_STATUS_BAD_REQUEST,
        );
    }

    async delete(): Promise<UnimplementedMethodResponse> {
        return new UnimplementedMethodResponse();
    }
}
