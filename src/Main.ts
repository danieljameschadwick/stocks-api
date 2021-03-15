import UserController from './controller/UserController';

import 'reflect-metadata';
import { json } from 'express';
import { createConnection, getManager } from 'typeorm';
import { graphqlHTTP } from 'express-graphql';
import { Action, createExpressServer } from 'routing-controllers';
import MainController from './controller/MainController';
import PlayerController from './controller/PlayerController';
import TeamController from './controller/TeamController';
import StockController from './controller/StockController';
import UserStockController from './controller/UserStockController';
import { StockResolver } from './resolver/StockResolver';
import { buildSchema } from 'type-graphql';
import CorsMiddleware from './middleware/CorsMiddleware';
import { User } from './entity/User';
import UserService from './service/UserService';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwtStrategy = require('passport-jwt').Strategy;
const extractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

createConnection().then(async () => {
    const app = createExpressServer({
        routePrefix: '/api',
        cors: false,
        controllers: [
            MainController,
            PlayerController,
            TeamController,
            StockController,
            UserController,
            UserStockController,
        ],
        middlewares: [
            CorsMiddleware,
        ],
        authorizationChecker: (action: Action) => new Promise<boolean>((resolve, reject) => {
            passport.authenticate('jwt', (err, user) => {
                if (err) {
                    return reject(err);
                }

                if (!user) {
                    return resolve(false);
                }

                action.request.user = user;
                return resolve(true);
            })(action.request, action.response, action.next);
        }),
        currentUserChecker: (action: Action) => action.request.user,
    });
    const port = 4000;

    app.use(json());

    const schema = await buildSchema({
        resolvers: [
            StockResolver,
        ],
    });

    app.use(
        '/graphql',
        graphqlHTTP({
            schema,
            graphiql: true,
        }),
    );

    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy(
        async (username, password, done) => {
            const userService = new UserService();

            const userResponse = await userService.getByUsername(username);
            const user = userResponse.data;

            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }

            if (user.password !== password) {
                return done(null, false, { message: 'Incorrect password.' });
            }

            const payload = {
                sub: user.id,
            };

            return done(null, user);
        },
    ));

    const opts = {
        jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'TOP_SECRET',
    };

    passport.use(new jwtStrategy(opts, (async (jwt_payload, done) => {
        const userRepository = getManager().getRepository(User);

        const user = await userRepository.findOne({ id: jwt_payload.sub });

        if (user) {
            return done(null, user);
        }
        return done(null, false);
    })));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        const userRepository = getManager().getRepository(User);
        const user = await userRepository.findOne({ id });

        done(null, user);
    });

    app.post('/login', passport.authenticate('local'), (req, res, next) => passport.authenticate('local', (err, user, info) => {
        if (err) {
            return;
        }

        const body = { id: user.id, username: user.username };
        const token = jwt.sign({ user: body }, 'TOP_SECRET');

        return res.json({
            success: true,
            message: 'You have successfully logged in!',
            token,
            user,
            info,
        });
    })(req, res, next));

    passport.use(
        new jwtStrategy(
            {
                secretOrKey: 'TOP_SECRET',
                jwtFromRequest: extractJwt.fromUrlQueryParameter('secret_token'),
            },
            async (token, done) => {
                try {
                    return done(null, token.user);
                } catch (error) {
                    return done(null, { verified: false });
                }
            },
        ),
    );

    app.post('/verify', passport.authenticate('jwt', { session: false }),
        (req, res) => {
            res.send({
                verified: true,
            });
        });

    app.listen(port, () => {
        // eslint-disable-next-line no-console
        console.log(`App listening at http://localhost:${port}`);
    });
});
