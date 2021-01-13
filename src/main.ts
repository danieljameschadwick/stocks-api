import 'reflect-metadata';
import express, { json } from 'express';
import { createConnection } from 'typeorm';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import { Player } from './entity/Player';
import { createExpressServer } from 'routing-controllers';
import { MainController } from './controller/MainController';
import { PlayerController } from './controller/PlayerController';

createConnection().then(() => {
    // const app = express();
    const app = createExpressServer({
        // controllers: [__dirname + '/controller/*.js'], // @TODO: doesn't feel right importing JS file in TS?
        controllers: [
            MainController,
            PlayerController
        ]
    });
    const port = 3000;

    app.use(json());

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