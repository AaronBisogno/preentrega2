import { ProductManager } from '../build/ProductManagerFs.js';
import { __dirname, previousDirectory } from './path.js';

export const connectSockets = (server) => {
   const productManager = new ProductManager(`${previousDirectory}/dao/products`);

   const msgs = [];

   server.on('connection', (socket) => {
      console.log(`New client connected ${socket.id}`);

      socket.on('new-Product', async (newProduct) => {
         await productManager.addProduct(newProduct);
         const products = await productManager.getProducts();
         server.emit('products', products);
      });

      socket.on('delete-Product', async (productId) => {
         await productManager.deleteProduct(productId);
         const products = await productManager.getProducts();
         server.emit('products', products);
      });

      socket.on('msg_toback', (msg) => {
         msgs.unshift(msg);
         socket.emit('msg_tofront', msgs);
      });
   });
};
