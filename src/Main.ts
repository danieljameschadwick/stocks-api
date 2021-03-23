import { json } from 'express';
import 'reflect-metadata';
import { createConnection, getManager } from 'typeorm';
// eslint-disable-next-line import/no-extraneous-dependencies
import { graphqlHTTP } from 'express-graphql'; // @TODO: debug as it is in dev deps
import { Action, createExpressServer } from 'routing-controllers';
import { buildSchema } from 'type-graphql';
import { StockResolver } from './resolver/StockResolver';
import CorsMiddleware from './middleware/CorsMiddleware';
import { User } from './entity/User';
import { UserService } from './service/UserService';
import MainController from './controller/MainController';
import UserController from './controller/UserController';
import PlayerController from './controller/PlayerController';
import TeamController from './controller/TeamController';
import StockController from './controller/StockController';
import UserStockController from './controller/UserStockController';
import { container } from './di/Container';
import { TYPES } from './di/Types';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
// eslint-disable-next-line prefer-destructuring
const ExtractJwt = require('passport-jwt').ExtractJwt;
const Jwt = require('jsonwebtoken');

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
            passport.authenticate('jwt', (error, user) => {
                if (error) {
                    return reject(error);
                }

                if (!user) {
                    return resolve(false);
                }

                const { request } = action.request;
                request.user = user;

                return resolve(true);
            })(action.request, action.response, action.next);
        }),
        currentUserChecker: (action: Action) => action.request.user,
    });
    const port = 4000; // @TODO: secrets?

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
            const userService = container.get<UserService>(TYPES.UserService);

            const userResponse = await userService.getByUsername(username);
            const user = userResponse.data;

            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }

            if (user.password !== password) {
                return done(null, false, { message: 'Incorrect password.' });
            }

            return done(null, user);
        },
    ));

    const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'TOP_SECRET', // @TODO: secrets?
    };

    passport.use(new JwtStrategy(opts, (async (jwtPayload, done) => {
        const userRepository = getManager().getRepository(User);

        const user = await userRepository.findOne({ id: jwtPayload.sub });

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

    app.post('/login', passport.authenticate('local'), (request, response, next) => passport.authenticate('local', (error, user, info) => {
        if (error) {
            return;
        }

        const body = { id: user.id, username: user.username };
        const token = Jwt.sign({ user: body }, 'TOP_SECRET');

        response.json({
            success: true,
            message: 'You have successfully logged in!',
            token,
            user,
            info,
        });
    })(request, response, next));

    passport.use(
        new JwtStrategy(
            {
                secretOrKey: 'TOP_SECRET',
                jwtFromRequest: ExtractJwt.fromUrlQueryParameter('secret_token'),
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
        (request, response) => response.send({
            verified: true,
        }));

    app.listen(port, () => {
        // eslint-disable-next-line no-console
        console.log(`App listening at http://localhost:${port}`);
    });
});
