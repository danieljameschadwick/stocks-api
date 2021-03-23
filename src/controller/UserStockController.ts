import { json, Request, Response } from 'express';
import {
    Controller, Delete, Get, Post, Req, Res, UseBefore,
} from 'routing-controllers';
import UserStockService from '../service/UserStockService';
import { UserStockDTO } from '../dto/UserStockDTO';
import { TYPES } from '../di/Types';
import { container } from '../di/Container';

@Controller('/user/:username/stock')
@UseBefore(json())
class UserStockController {
    private userStockService: UserStockService;

    constructor() {
        this.userStockService = container.get<UserStockService>(TYPES.UserStockService);
    }

    @Get('/:abbreviation?')
    async getAll(@Req() request: Request, @Res() response: Response) {
        const { username, abbreviation } = request.params;

        return await this.userStockService.getAll(username, abbreviation);
    }

    @Get('/id/:id')
    async get(@Req() request: Request, @Res() response: Response) {
        const id = parseInt(request.params.id, 10);

        return await this.userStockService.get(id);
    }

    @Post('/buy')
    async buy(@Req() request: Request, @Res() response: Response) {
        const username = request.params.username.toString();
        const { stock } = request.body;
        const quantity = Number(request.body.quantity);

        const userStock = new UserStockDTO(
            username,
            stock.abbreviation,
            quantity,
        );

        return await this.userStockService.buy(userStock);
    }

    @Post('/sell/:id')
    async sell(@Req() request: Request, @Res() response: Response) {
        const username = request.params.username.toString();
        const id = parseInt(request.params.id, 10);

        return this.userStockService.sell(id, username);
    }

    @Delete('/:id')
    async delete(@Req() request, @Res() response) {
        return response.send('Unimplemented.');
    }
}

export default UserStockController;
