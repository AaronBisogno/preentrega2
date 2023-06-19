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

   res.render('home', { result, pagination: rest, title: 'Bull Market | Home' });
});

viewsRouter.get('/products', async (req, res) => {
   let { limit } = req.query;
   let { page } = req.query;

   const queryResult = await ProductModel.paginate({}, { limit: limit || 10, page: page || 1 });
   const { docs, ...rest } = queryResult;
   const result = docs.map((doc) => {
      return { title: doc.title, description: doc.description, code: doc.code, price: doc.price, stock: doc.stock, category: doc.category, thumbnail: doc.thumbnail, id: doc.id };
   });

   res.render('products', { result, pagination: rest, title: 'Bull Market | Products' });
});

viewsRouter.get('/products/:pid', async (req, res) => {
   try {
      const { pid } = req.params;
      const product = await productService.getProduct(pid);
      res.render('product', { product, title: 'Bull Market | Product' });
   } catch {
      res.render('404', { title: '404 Page not found' });
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
      res.render('carts', { cart, result, cid, title: 'Bull Market | Cart' });
   } catch {
      res.render('404', { title: 'Bull Market | 404 Page not found' });
   }
});

viewsRouter.get('/realtimeproducts', async (req, res) => {
   const products = await productService.getProducts();
   res.render('realTimeProducts', { products, title: 'Bull Market | Products' });
});

viewsRouter.get('/chat', (req, res) => {
   res.render('chat', { title: 'Bull Market | Chat Online' });
});

viewsRouter.get('/login', (req, res) => {
   res.render('login', { isLogin: true, title: 'Bull Market | Log In' });
});

viewsRouter.get('/register', (req, res) => {
   res.render('register', { isLogin: true, title: 'Bull Market | Create Account' });
});

viewsRouter.get('*', (req, res) => {
   res.render('404', { title: 'Bull Market | Page not found' });
});
