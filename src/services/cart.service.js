import { CartModel } from '../dao/models/carts.model.js';
import { ProductModel } from '../dao/models/products.model.js';

export class CartService {
   async createCart() {
      return await CartModel.create({});
   }

   async addProductToCart(cid, pid) {
      const cart = await CartModel.findOne({ _id: cid });
      const product = await ProductModel.findOne({ _id: pid });
      if (product) {
         cart.products.push({ product: product });
         await cart.save();
         return cart;
      } else {
         return `Product id does not exist! Please insert a valid id.`;
      }
   }

   async getCarts() {
      const carts = await CartModel.find({});
      return carts;
   }

   async getCart(cid) {
      const cart = await CartModel.findOne({ _id: cid });
      return cart.products;
   }

   async removeProductFromCart(cid, pid) {
      const cart = await CartModel.findOne({ _id: cid });
      const productIndex = cart.products.findIndex((product) => product._id === pid);
      if (productIndex !== -1) {
         cart.products.splice(productIndex, 1);
         await cart.save();
         return 'Product deleted successfully!';
      } else {
         return 'Product id does not exist in the cart!';
      }
   }

   async deleteCart(cid) {
      const deletedCart = await CartModel.deleteOne({ _id: cid });
      return `Cart ${cid} was successfully deleted!`;
   }
}
