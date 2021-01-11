import 'reflect-metadata';
import { createConnection } from 'typeorm';
import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import { Player } from './entity/player';

const app = express();
const port = 3000;
app.use(express.json());

var schema = buildSchema(`
    type Player {
		id: Int
		fullName: String
    }

    type Query {
        player(id: Int): Player
    }
`);

var root = {
	player: ({ id }) => {
		return new Player('Daniel', 'Chadwick');
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

	createConnection()
		.then((connection) => {
			const player = new Player();
			player.firstName = data.firstName;
			player.lastName = data.lastName;

			return connection
				.getRepository(Player)
				.save(player)
				.then((player) => {
					console.log('Player has been saved: ', player);
				});
		})
		.catch((error) => console.log('Error: ', error));

	response.send({
		message: `User with ${player.id} of ${data.firstName} ${data.lastName}`,
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
