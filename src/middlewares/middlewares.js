import { cartRouter } from '../routes/carts.routes.js';
import { productsRouter } from '../routes/products.routes.js';
import { viewsRouter } from '../routes/views.routes.js';
import { usersRouter } from '../routes/users.routes.js';
import { __dirname, previousDirectory } from '../utils/path.js';
import express from 'express';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import { authRouter } from '../routes/auth.routes.js';

export const middlewares = (app) => {
    app.use(
        session({
            store: MongoStore.create({ mongoUrl: 'mongodb+srv://aaronchodev:DfarmP7npcTtbgn9@ecommerce.igp15kx.mongodb.net/ecommerce?retryWrites=true&w=majority', ttl: 3600 }),
            secret: 'secretCoder',
            resave: true,
            saveUninitialized: true,
        })
    );
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(`${previousDirectory}/public`));
    app.use('/', authRouter);
    app.use('/api/products', productsRouter);
    app.use('/api/carts', cartRouter);
    app.use('/api/users', usersRouter);
    app.use('/', viewsRouter);
};
