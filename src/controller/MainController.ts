import { json, Response } from 'express';
import {
    Controller, Get, Res, UseBefore,
} from 'routing-controllers';

@Controller()
@UseBefore(json())
class MainController {
    @Get('/')
    get(@Res() response: Response) {
        return response.send({
            healthCheck: true,
            statusCode: 200,
        });
    }
}

export default MainController;
