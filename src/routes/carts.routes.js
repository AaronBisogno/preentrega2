import express from 'express';
import { CartService } from '../services/cart.service.js';

export const cartRouter = express.Router();

const cartService = new CartService();

cartRouter.get('/', async (req, res) => {
   const countLimit = req.query.limit;
   const carts = await cartService.getCarts();

   if (countLimit) {
      const result = carts.slice(0, countLimit);
      return res.status(200).send({ result });
   } else {
      const modifiedCarts = carts.map((cart) => {
         const modifiedCart = { _id: cart._id.toString(), products: cart.products };
         return modifiedCart;
      });
      return res.status(200).send({
         status: 'success',
         msg: 'Carts found:',
         data: modifiedCarts,
      });
   }
});

cartRouter.get('/:cid', async (req, res) => {
   const cid = req.params.cid;
   try {
      const result = await cartService.getCart(cid);
      res.status(200).send({
         status: 'success',
         msg: `Cart id: '${cid}' founded:`,
         data: `Products: ${result}`,
      });
   } catch {
      res.status(404).send({
         status: 'error',
         msg: 'Something went wrong!',
      });
   }
});

cartRouter.post('/', async (req, res) => {
   try {
      const result = await cartService.createCart();
      res.status(200).send({
         status: 'success',
         msg: `Cart created:`,
         data: {cartId: result._id, products: result.products}
      });
   } catch {
      res.status(404).send({
         status: 'error',
         msg: 'Something went wrong!',
      });
   }
});

cartRouter.post('/:cid/product/:pid', async (req, res) => {
   const cid = req.params.cid;
   const pid = req.params.pid;
   try {
      const productAdded = await cartService.addProductToCart(cid, pid);
      res.status(200).send({
         status: 'success',
         msg: `Product added:`,
         data: `${JSON.stringify(productAdded)}`
      });
   } catch {
      res.status(404).send({
         status: 'error',
         msg: 'Something went wrong!',
      });
   }
});

cartRouter.delete('/:cid/product/:pid', async (req, res) => {
   const cid = req.params.cid;
   const pid = req.params.pid;
   try{
      const productRemoved = await cartService.removeProductFromCart(cid, pid);
      res.status(200).send({
         status: 'success',
         msg: `Product deleted:`,
         data: `${JSON.stringify(productRemoved)}`
      });
   } catch{
      res.status(404).send({
         status: 'error',
         msg: 'Something went wrong!',
      });
   }
});

cartRouter.delete('/:cid', async (req, res) => {
   const cid = req.params.cid;
   try{
      const deletedCart = await cartService.deleteCart(cid);
      res.status(200).send({
         status: 'success',
         msg: `Cart deleted`,
         data: `${deletedCart}`
      });
   } catch {
      res.status(404).send({
         status: 'error',
         msg: 'Something went wrong!',
      });
   }
})
