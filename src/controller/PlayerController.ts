import { Request, response, Response } from 'express';
import { Controller, Get, Post, Req, Res } from 'routing-controllers';
import { getConnectionManager, Repository } from 'typeorm';
import { Player } from '../entity/Player';

@Controller()
class PlayerController {
    private playerRepository: Repository<Player>;

    constructor() {
        this.playerRepository = getConnectionManager().get().getRepository(Player);
    }

    @Get('/player/:id')
    get(@Req() request: Request, @Res() response: Response) {
        const id = request.params.id;
        const player = this.playerRepository.findOne(id);

        if (player === null) {
            return response.send({
                message: `Player with :id of ${id} was not found.`,
                data: {}
            });
        }

        player.then((player) => {
            return response.send({
                message: `Player with :id of ${player.getId()} was found.`,
                data: player
            });
        });

        return response.send({
            message: `Player with :id of ${id} was not found.`,
            data: {}
        });
    }

    @Post('/player')
    create(@Req() request: Request, @Res() response: Response) {
        const data = request.body;
        const player = new Player(
            data.firstName,
            data.lastName
        );

        this.playerRepository.save(player).then((player) => {
            return response.send({
                message: `Player with ${player.getId()} of ${player.getFullName()}`,
                data: player,
            });
        });

        return response.send({
            message: `Player name of ${player.getFullName()} wasn't created?`,
            data: {},
        });
    }
}

export {
    PlayerController
};