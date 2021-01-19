import 'reflect-metadata';
import { json } from 'express';
import { createConnection } from 'typeorm';
import { graphqlHTTP } from 'express-graphql';
import { createExpressServer } from 'routing-controllers';
import { MainController } from './controller/MainController';
import { PlayerController } from './controller/PlayerController';
import { TeamController } from './controller/TeamController';
import { StockController } from './controller/StockController';
import { StockResolver } from './resolver/StockResolver';
import { buildSchema } from 'type-graphql';

createConnection().then(async () => {
    const app = createExpressServer({
        controllers: [
            MainController,
            PlayerController,
            TeamController,
            StockController
        ]
    });
    const port = 3000;

    app.use(json());

    const schema = await buildSchema({
        resolvers: [StockResolver]
    });

    app.use(
        '/graphql',
        graphqlHTTP({
            schema: schema,
            graphiql: true
        }),
    );

    app.listen(port, () => {
        console.log(`App listening at http://localhost:${port}`);
    });
});