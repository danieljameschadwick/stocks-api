import 'reflect-metadata';
import { createConnection, getManager } from 'typeorm';
import express, { Request, Response } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import { Player } from './entity/Player';

createConnection().then((connection) => {
    const app = express();
    const port = 3000;
    const playerRepository = connection.getRepository(Player);

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
            const player = new Player();
            player.firstName = 'Daniel';
            player.lastName = 'Chadwick';

            return player;
        },
    };

    app.get('/', (request: Request, response: Response) => {
        response.send({
            healthCheck: true,
            statusCode: 200
        });
    });

    app.get('/player/:id', async (request: Request, response: Response) => {
        const id = request.params.id;
        const player = await playerRepository.findOne(id);

        if (player === undefined) {
            return response.send({
                message: `Player with :id of ${id} could not be found.`,
                data: {}
            });
        }

        response.send({
            message: `Player with :id of ${player.getId()} was found.`,
            data: player
        });
    });

    app.post('/player', async (request: Request, response: Response) => {
        const data = request.body;
        const player = new Player();

        player.firstName = data.firstName;
        player.lastName = data.lastName;

        await playerRepository.save(player);

        response.send({
            message: `Player with ${player.getId()} of ${player.getFullName()}`,
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