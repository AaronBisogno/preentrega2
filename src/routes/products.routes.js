import express from 'express';
import { __dirname, previousDirectory } from '../utils/path.js';
import { ProductManager } from '../build/ProductManagerFs.js';

export const productsRouter = express.Router();
export const productManager = new ProductManager(`${previousDirectory}/dao/products`);

productsRouter.get('/', async (req, res) => {
   const countLimit = req.query.limit;
   const products = await productManager.getProducts();
   if (countLimit) {
      const limit = parseInt(countLimit);
      const result = products.slice(0, limit);
      return res.status(200).send({ result });
   } else return res.status(200).send({ products });
});

productsRouter.get('/:pid', async (req, res) => {
   const productId = req.params.pid;
   if (productId) {
      const id = parseInt(productId);
      const result = await productManager.getProductById(id);
      res.status(200).send({ result });
   } else res.status(404).send({ status: 'error', msg: 'Product not found.' });
});

productsRouter.post('/', async (req, res) => {
   const newProduct = req.body;
   const result = await productManager.addProduct(newProduct);
   res.send({ result });
});

productsRouter.put('/:pid', async (req, res) => {
   const productid = parseInt(req.params.pid);
   const newInfo = req.body;
   if (newInfo && Object.keys(newInfo).length > 0) {
      const updatedProduct = await productManager.updateProduct(productid, newInfo);
      res.status(200).send({ updatedProduct });
   } else {
      res.status(400).send({ error: 'Invalid update, info missing.' });
   }
});

productsRouter.delete('/:pid', async (req, res) => {
   const productId = parseInt(req.params.pid);
   const product = await productManager.deleteProduct(productId);
   res.status(200).send({ product });
});
