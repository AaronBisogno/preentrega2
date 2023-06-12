import { CartModel } from '../dao/models/carts.model.js';
import { ProductModel } from '../dao/models/products.model.js';

export class CartService {
   async create() {
      return await CartModel.create({});
   }

   async addProductToCart(cid, pid) {
      const cart = await CartModel.findOne({ _id: cid })
      const product = await ProductModel.findOne({ _id: pid })
      cart.products.push( product );
      await cart.save();
      return `Cart Id: ${cart._id}, Products: ${JSON.stringify(cart.products)}`;
   }

   async getCarts() {
      const carts = await CartModel.find({}).lean();
      return carts;
   }

   async getCart(cid) {
      const cart = await CartModel.findOne({ _id: cid }).populate('products.product');
      return cart;
   }

   async removeProductFromCart(cid, pid) {
      const cart = await CartModel.findOne({ _id: cid})
      const index = cart.products.findIndex((i) => i._id.equals(pid))
      if (index === -1){
         return 'Product id doesnt exist. Please insert a valid id.'
      } else{
         cart.products.splice(index, 1);
         await cart.save();
         return `Product ${pid} was successfully removed from Cart ${cid}!`;
      }
   }

   async clear(cid) {
      await CartModel.findOneAndUpdate(
         { _id: cid },
         { $set: { products: [] } },
         { new: true }
      )
      return `Cart ${cid} was successfully cleaned!`;
   }
}
