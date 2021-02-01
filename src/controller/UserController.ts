import { json, Request, Response } from 'express';
import { Controller, Delete, Get, Post, Put, Req, Res, UseBefore } from 'routing-controllers';
import UserService from '../service/UserService';

@Controller('/user')
@UseBefore(json())
class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    @Get('/')
    async all(@Req() request: Request, @Res() response: Response) {
        return response.send('Unimplemented.');
    }

    @Get('/:id')
    async get(@Req() request: Request, @Res() response: Response) {
        return response.send('Unimplemented.');
    }

    @Post('/')
    async create(@Req() request: Request, @Res() response: Response) {
        return response.send('Unimplemented.');
    }

    @Put('/:id')
    async update(@Req() request: Request, @Res() response: Response) {
        return response.send('Unimplemented.');
    }

    @Delete('/:id')
    async delete(@Req() request, @Res() response) {
        return response.send('Unimplemented.');
    }
}

export default UserController;