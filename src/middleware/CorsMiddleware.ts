import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import { NextFunction, Request, Response } from 'express';

/**
 * Seems to be an issue surrounding routing-controllers and CORS
 * so disabled any checking whilst in dev
 */
@Middleware({ type: 'before' })
class CorsMiddleware implements ExpressMiddlewareInterface {
    use(request: Request, response: Response, next?: NextFunction): any {
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        next();
    }
}

export default CorsMiddleware;
