import express from 'express';
import { __dirname, previousDirectory } from '../utils/path.js';
import { ProductManager } from '../build/ProductManagerFs.js';

export const viewsRouter = express.Router();
const productManager = new ProductManager(`${previousDirectory}/dao/products`);

viewsRouter.get('/', async (req, res) => {
   const products = await productManager.getProducts();
   res.render('home', { products: products });
});

viewsRouter.get('/realtimeproducts', async (req, res) => {
   const products = await productManager.getProducts();
   res.render('realTimeProducts', { products: products });
});

viewsRouter.get('/chat', (req, res) => {
   return res.render('chat', {});
});
