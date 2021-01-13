import { Request, Response } from 'express';
import { Controller, Get, Post, Req, Res } from 'routing-controllers';

@Controller()
class MainController {
    @Get('/')
    get(@Req() request: Request, @Res() response: Response) {
        return response.send({
            healthCheck: true,
            statusCode: 200
        });
    }
}

export {
    MainController
};