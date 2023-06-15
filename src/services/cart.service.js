import { CartModel } from '../dao/models/carts.model.js';

export class CartService {
   async create() {
      try {
         return await CartModel.create({});
      } catch (error) {
         throw new Error('Error creating Cart!', error);
      }
   }

   async addProductToCart(cid, pid) {
      try {
         const cart = await CartModel.findOneAndUpdate({ _id: cid }, { $push: { products: { product: pid } } }, { new: true });
         return cart;
      } catch (error) {
         throw new Error('Error adding product to cart!', error);
      }
   }

   async getCarts() {
      try {
         const carts = await CartModel.find({}).lean();
         return carts;
      } catch (error) {
         throw new Error('Error getting the Carts!', error);
      }
   }

   async getCart(cid) {
      try {
         const cart = await CartModel.findOne({ _id: cid });
         return cart;
      } catch (error) {
         throw new Error('Error getting the cart!', error);
      }
   }

   async removeProductFromCart(cid, pid) {
      try {
         const cart = await CartModel.findOne({ _id: cid });
         const index = cart.products.findIndex((i) => i.product._id.equals(pid));
         if (index === -1) {
            return 'Product id doesnt exist. Please insert a valid id.';
         } else {
            cart.products.splice(index, 1);
            await cart.save();
            return `Product ${pid} was successfully removed from Cart ${cid}!`;
         }
      } catch (error) {
         throw new Error('Error deleting the product from the cart!', error);
      }
   }

   async quantity(cid, pid, q) {
      try {
         const cart = await CartModel.findOne({ _id: cid });
         const pi = cart.products.findIndex((item) => item.product.equals(pid));

         if (productIndex !== -1) {
            cart.products[pi].product.quantity = q;
            await cart.save();
            return cart.products[pi].product;
         } else {
            throw new Error('Product not found in the cart.');
         }
      } catch (error) {
         throw new Error('Error updating the quantity of the product!', error);
      }
   }

   async clear(cid) {
      try {
         await CartModel.findOneAndUpdate({ _id: cid }, { $set: { products: [] } }, { new: true });
         return `Cart ${cid} was successfully cleaned!`;
      } catch (error) {
         throw new Error('Error cleaning the cart!', error);
      }
   }
}
