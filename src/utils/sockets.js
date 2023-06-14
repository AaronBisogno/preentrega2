import { ProductService } from '../services/product.service.js';
import { CartService } from '../services/cart.service.js';

export const connectSockets = (server) => {

   const productService = new ProductService();
   const cartService = new CartService();

   const msgs = [];

   server.on('connection', (socket) => {

      socket.on('new-Product', async (newProduct) => {
         await productService.createProduct(newProduct);
         const products = await productService.getProducts();
         server.emit('products', products);
      });

      socket.on('delete-Product', async (pid) => {
         await productService.deleteProduct(pid);
         const products = await productService.getProducts();
         server.emit('products', products);
      });

      socket.on('msg_toback', (msg) => {
         msgs.unshift(msg);
         socket.emit('msg_tofront', msgs);
      });

      socket.on('removeFromCart', async ({cid, pid}) => {
         await cartService.removeProductFromCart(cid, pid);
         const cart = await cartService.getCart(cid);
         const { products } = cart;
         const result = [];
         for (const item of products) {
            result.push(item.product);
         }
         socket.emit('cartUpdated', result)
      });
   });
};
