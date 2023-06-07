import express from 'express';
import { ProductService } from '../services/product.service.js';

export const viewsRouter = express.Router();
const productService = new ProductService();

viewsRouter.get('/', async (req, res) => {
   const products = await productService.getProducts();
   res.render('home', { products: products });
});

viewsRouter.get('/realtimeproducts', async (req, res) => {
   const products = await productService.getProducts();
   res.render('realTimeProducts', { products: products });
});

viewsRouter.get('/chat', (req, res) => {
   return res.render('chat', {});
});
