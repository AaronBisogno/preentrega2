import express from 'express';
import { ProductService } from '../services/product.service.js';
import { ProductModel } from '../dao/models/products.model.js';

export const viewsRouter = express.Router();
const productService = new ProductService();

viewsRouter.get('/', async (req, res) => {
   let { limit } = req.query;
   let { page } = req.query;

   const queryResult = await ProductModel.paginate(
      {},
      {limit: limit || 10, page: page || 1}
   );
   const { docs, ...rest } = queryResult;
   const result = docs.map(doc => {
      return {title: doc.title, description: doc.description, code: doc.code, price: doc.price, stock: doc.stock, category: doc.category, thumbnail: doc.thumbnail, id: doc.id}
   })

   res.render('home', { result, pagination: rest });
});
viewsRouter.get('/products', async (req, res) => {
   let { limit } = req.query;
   let { page } = req.query;

   const queryResult = await ProductModel.paginate(
      {},
      {limit: limit || 10, page: page || 1}
   );
   const { docs, ...rest } = queryResult;
   const result = docs.map(doc => {
      return {title: doc.title, description: doc.description, code: doc.code, price: doc.price, stock: doc.stock, category: doc.category, thumbnail: doc.thumbnail, id: doc.id}
   })

   res.render('products', { result, pagination: rest });
});

viewsRouter.get('/realtimeproducts', async (req, res) => {
   const products = await productService.getProducts();
   res.render('realTimeProducts', { products });
});

viewsRouter.get('/chat', (req, res) => {
   return res.render('chat', {});
});
