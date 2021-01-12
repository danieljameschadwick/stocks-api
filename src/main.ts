import 'reflect-metadata';
import { createConnection, getManager } from 'typeorm';
import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import { Player } from './entity/Player';

createConnection().then(() => {
    const app = express();
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
            const player = new Player();
            player.firstName = 'Daniel';
            player.lastName = 'Chadwick';

            return player;
        },
    };

    app.get('/', (request, response) => {
        response.send({
            healthCheck: true,
            statusCode: 200
        });
    });

    app.get('/user/:id', (request, response) => {
        response.send({
            message: `User with :id of ${request.params.id}`,
        });
    });

    app.post('/user', (request, response) => {
        const data = request.body;
        const player = new Player();

        player.firstName = data.firstName;
        player.lastName = data.lastName;

        console.log(player);

        getManager()
            .getRepository(Player)
            .save(player)
            .then((player) => {
                console.log('Player has been saved: ', player);
            });

        response.send({
            message: `User with ${player.getId()} of ${player.getFullName()}`,
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