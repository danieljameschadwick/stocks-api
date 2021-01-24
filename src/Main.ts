const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');

import 'reflect-metadata';
import { json } from 'express';
import { createConnection, getManager } from 'typeorm';
import { graphqlHTTP } from 'express-graphql';
import { createExpressServer } from 'routing-controllers';
import { MainController } from './controller/MainController';
import { PlayerController } from './controller/PlayerController';
import { TeamController } from './controller/TeamController';
import { StockController } from './controller/StockController';
import { StockResolver } from './resolver/StockResolver';
import { buildSchema } from 'type-graphql';
import { CorsMiddleware } from './middleware/CorsMiddleware';
import { User } from './entity/User';

createConnection().then(async () => {
    const app = createExpressServer({
        routePrefix: '/api',
        cors: false,
        controllers: [
            MainController,
            PlayerController,
            TeamController,
            StockController,
        ],
        middlewares: [
            CorsMiddleware,
        ]
    });
    const port = 4000;

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

    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy(
        async function (username, password, done) {
            const userRepository = getManager().getRepository(User);

            const user = await userRepository.findOne({username: username});

            if (!user) {
                return done(null, false, {message: 'Incorrect username.'});
            }

            if (user.password !== password) {
                return done(null, false, {message: 'Incorrect password.'});
            }

            const payload = {
                sub: user.id
            };

            const token = jwt.sign(payload, 'a secret phrase!!');

            return done(null, token, user);
        }
    ));

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(async function (id, done) {
        const userRepository = getManager().getRepository(User);
        const user = await userRepository.findOne({id: id});

        done(null, user);
    });

    app.post('/login', passport.authenticate('local'), function (req, res) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        console.log(req.user);

        res.redirect('/users/' + req.user.username);
    });

    app.listen(port, () => {
        console.log(`App listening at http://localhost:${port}`);
    });
});