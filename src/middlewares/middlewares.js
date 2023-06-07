import { cartRouter } from '../routes/carts.routes.js';
import { productsRouter } from '../routes/products.routes.js';
import { viewsRouter } from '../routes/views.routes.js';
import { usersRouter } from '../routes/users.routes.js';
import { __dirname, previousDirectory } from '../utils/path.js';
import express from 'express';

export const middlewares = (app) => {
   app.use(express.json());
   app.use(express.urlencoded({ extended: true }));
   app.use(express.static(`${previousDirectory}/public`));
   app.use('/', viewsRouter);
   app.use('/api/products', productsRouter);
   app.use('/api/carts', cartRouter);
   app.use('/api/users', usersRouter);
   app.use('*', (req, res) => {
      res.status(404).send({ msg: 'Route not found' });
   });
};
