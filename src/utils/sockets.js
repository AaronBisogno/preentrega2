import { ProductManager } from '../build/ProductManagerFs.js';
import { ProductService } from '../services/product.service.js';

export const connectSockets = (server) => {
   const productService = new ProductService();

   const msgs = [];

   server.on('connection', (socket) => {
      console.log(`New client connected ${socket.id}`);

      socket.on('new-Product', async (newProduct) => {
         await productService.createProduct(newProduct);
         const products = await productService.getProducts();
         server.emit('products', products);
      });

      socket.on('delete-Product', async (productId) => {
         await productService.deleteProduct(productId);
         const products = await productService.getProducts();
         server.emit('products', products);
      });

      socket.on('msg_toback', (msg) => {
         msgs.unshift(msg);
         socket.emit('msg_tofront', msgs);
      });
   });
};
