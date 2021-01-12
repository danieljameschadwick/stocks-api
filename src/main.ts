import 'reflect-metadata';
import { createConnection, getManager } from 'typeorm';
import express, { Request, Response } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import { Player } from './entity/Player';
import { createExpressServer } from 'routing-controllers';

createConnection().then(() => {
    // const app = express();
    const app = createExpressServer({
        controllers: [__dirname + '/controller/*.js'], // @TODO: doesn't feel right importing JS file in TS?
    });
    const port = 3000;

    app.use(express.json());

    const schema = buildSchema(`
        type Player {
            id: Int
            fullName: String
        }
    
        type Query {
            player(id: Int): Player
        }
    `);

    const root = {
        player: ({ id }) => {
            return new Player('Daniel', 'Chadwick');
        },
    };

    app.get('/', (request: Request, response: Response) => {
        response.send({
            healthCheck: true,
            statusCode: 200
        });
    });

    app.use(
        '/graphql',
        graphqlHTTP({
            schema: schema,
            rootValue: root,
        })
    );

    app.listen(port, () => {
        console.log(`App listening at http://localhost:${port}`);
    });
});