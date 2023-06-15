import express from 'express';
import { ProductService } from '../services/product.service.js';
import { ProductModel } from '../dao/models/products.model.js';

const productService = new ProductService();

export const productsRouter = express.Router();

productsRouter.get('/', async (req, res) => {
   const { limit, page } = req.query;
   const queryResult = await ProductModel.paginate({}, { limit: limit || 10, page: page || 1 });
   const { docs, ...rest } = queryResult;
   const result = docs.map((doc) => {
      return { title: doc.title, description: doc.description, code: doc.code, price: doc.price, stock: doc.stock, category: doc.category, thumbnail: doc.thumbnail, id: doc.id };
   });
   try {
      return res.status(200).send({
         status: 'success',
         payload: result,
         totalPages: rest.totalPages,
         prevPage: rest.prevPage,
         nextPage: rest.nextPage,
         page: rest.page,
         hasPrevPage: rest.hasPrevPage,
         hasNextPage: rest.hasNextPage,
         prevLink: rest.hasPrevPage ? `http://localhost:8080/api/products?page=${rest.prevPage}` : false,
         nextLink: rest.hasNextPage ? `http://localhost:8080/api/products?page=${rest.nextPage}` : false,
      });
   } catch {
      return res.status(404).send({
         status: 'error',
         payload: 'Products not found.',
      });
   }
});

productsRouter.get('/:pid', async (req, res) => {
   const productId = req.params.pid;
   try {
      const pid = productId;
      const result = await productService.getProduct(pid);
      res.status(200).send({
         status: 'success',
         msg: 'Products:',
         data: result,
      });
   } catch {
      res.status(404).send({
         status: 'error',
         msg: 'Product not found.',
      });
   }
});

productsRouter.post('/', async (req, res) => {
   const newProduct = req.body;
   try {
      const result = await productService.createProduct(newProduct);
      res.status(200).send({
         status: 'success',
         msg: 'Product created successfully!',
         data: result,
      });
   } catch {
      res.status(404).send({
         status: 'error',
         msg: 'Product info is missing.',
      });
   }

   res.send({ result });
});

productsRouter.put('/:pid', async (req, res) => {
   const pid = req.params.pid;
   const updateData = req.body;
   try {
      const product = await productService.updateProduct(pid, updateData);
      res.status(200).send({
         status: 'success',
         msg: 'Product updated!.',
         date: product,
      });
   } catch {
      res.status(404).send({
         status: 'error',
         msg: 'Product id doesnt exist! Please enter a valid id.',
      });
   }
});

productsRouter.delete('/:pid', async (req, res) => {
   const pid = req.params.pid;
   try {
      const product = await productService.deleteProduct(pid);
      res.status(200).send({
         status: 'success',
         msg: 'Product deleted.',
         date: product,
      });
   } catch {
      res.status(404).send({
         status: 'error',
         msg: 'Product not found.',
      });
   }
});

productsRouter.delete('/', async (req, res) => {
   try {
      const product = await productService.deleteAll();
      res.status(200).send({
         status: 'success',
         msg: product,
      });
   } catch {
      res.status(404).send({
         status: 'error',
         msg: 'Product not found.',
      });
   }
});
