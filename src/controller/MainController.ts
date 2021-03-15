import { json, Request, Response } from 'express';
import {
    Controller, Get, Req, Res, UseBefore,
} from 'routing-controllers';

@Controller()
@UseBefore(json())
class MainController {
    @Get('/')
    get(@Req() request: Request, @Res() response: Response) {
        return response.send({
            healthCheck: true,
            statusCode: 200,
        });
    }
}

export default MainController;
