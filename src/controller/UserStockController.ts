import { json, Request, Response } from 'express';
import { Controller, Delete, Get, Post, Req, Res, UseBefore } from 'routing-controllers';
import UserService from '../service/UserService';
import UserStockService from '../service/UserStockService';
import { UserStockDTO } from '../dto/UserStockDTO';

@Controller('/user/:username/stock')
@UseBefore(json())
class UserStockController {
    private userService: UserService;
    private userStockService: UserStockService;

    constructor() {
        this.userService = new UserService();
        this.userStockService = new UserStockService();
    }

    @Get('/:abbreviation?')
    async get(@Req() request: Request, @Res() response: Response) {
        const { username, abbreviation } = request.params;

        return await this.userStockService.get(username, abbreviation);
    }

    @Post('/buy')
    async buy(@Req() request: Request, @Res() response: Response) {
        console.log(request.params);
        console.log(request.body);

        const username = request.params.username.toString();
        const { stock, quantity }  = request.body;

        const userStock = new UserStockDTO(
            username,
            stock.abbreviation,
            quantity
        );

        return await this.userStockService.buy(userStock);
    }

    @Post('/sell')
    async sell(@Req() request: Request, @Res() response: Response) {
        console.log(request.params);
        console.log(request.body);

        const username = request.params.username.toString();
        const { id }  = request.body;

        return response.send('Unimplemented.');
    }

    @Delete('/:id')
    async delete(@Req() request, @Res() response) {
        return response.send('Unimplemented.');
    }
}

export default UserStockController;