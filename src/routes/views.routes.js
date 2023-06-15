import express from 'express';
import { ProductService } from '../services/product.service.js';
import { ProductModel } from '../dao/models/products.model.js';
import { CartService } from '../services/cart.service.js';

export const viewsRouter = express.Router();
const productService = new ProductService();
const cartService = new CartService();

viewsRouter.get('/', async (req, res) => {
   let { limit } = req.query;
   let { page } = req.query;

   const queryResult = await ProductModel.paginate({}, { limit: limit || 10, page: page || 1 });
   const { docs, ...rest } = queryResult;
   const result = docs.map((doc) => {
      return { title: doc.title, description: doc.description, code: doc.code, price: doc.price, stock: doc.stock, category: doc.category, thumbnail: doc.thumbnail, id: doc.id };
   });

   res.render('home', { result, pagination: rest });
});

viewsRouter.get('/products', async (req, res) => {
   let { limit } = req.query;
   let { page } = req.query;

   const queryResult = await ProductModel.paginate({}, { limit: limit || 10, page: page || 1 });
   const { docs, ...rest } = queryResult;
   const result = docs.map((doc) => {
      return { title: doc.title, description: doc.description, code: doc.code, price: doc.price, stock: doc.stock, category: doc.category, thumbnail: doc.thumbnail, id: doc.id };
   });

   res.render('products', { result, pagination: rest });
});

viewsRouter.get('/products/:pid', async (req, res) => {
   try {
      const { pid } = req.params;
      const product = await productService.getProduct(pid);
      res.render('product', { product });
   } catch (error) {
      throw new Error('Product doesnt exist!', error);
   }
});

viewsRouter.get(`/carts/:cid`, async (req, res) => {
   try {
      const { cid } = req.params;
      const cart = await cartService.getCart(cid);
      const { products } = cart;
      const result = [];
      for (const item of products) {
         result.push(item.product);
      }
      res.render('carts', { cart, result, cid });
   } catch (error) {
      throw new Error('Cart doesnt exist!', error);
   }
});

viewsRouter.get('/realtimeproducts', async (req, res) => {
   const products = await productService.getProducts();
   res.render('realTimeProducts', { products });
});

viewsRouter.get('/chat', (req, res) => {
   return res.render('chat', {});
});
