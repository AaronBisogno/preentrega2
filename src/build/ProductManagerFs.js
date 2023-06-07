var __awaiter =
   (this && this.__awaiter) ||
   function (thisArg, _arguments, P, generator) {
      function adopt(value) {
         return value instanceof P
            ? value
            : new P(function (resolve) {
                 resolve(value);
              });
      }
      return new (P || (P = Promise))(function (resolve, reject) {
         function fulfilled(value) {
            try {
               step(generator.next(value));
            } catch (e) {
               reject(e);
            }
         }
         function rejected(value) {
            try {
               step(generator['throw'](value));
            } catch (e) {
               reject(e);
            }
         }
         function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
         }
         step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
   };
import * as fs from 'fs';
export class ProductManager {
   constructor(path, id, products) {
      this.id = 0;
      this.products = [];
      this.path = path + '.json';
      this.id = id !== null && id !== void 0 ? id : 0;
      this.products = products !== null && products !== void 0 ? products : [];
      // Checking if the .json file exists, else create it.
      if (fs.existsSync(this.path)) {
         const productsJson = fs.readFileSync(this.path, 'utf-8');
         const productsString = JSON.parse(productsJson);
         this.products = productsString;
      } else {
         fs.writeFileSync(this.path, '[]');
         this.products = [];
      }
   }
   addProduct(product) {
      return __awaiter(this, void 0, void 0, function* () {
         const codeUnique = this.products.find((p) => p.code === product.code);
         if (codeUnique) {
            return `Product already exists.`;
         } else {
            const lastProduct = this.products[this.products.length - 1];
            this.id = lastProduct ? lastProduct.id + 1 : 1;
            product.id = this.id;
            product.status = true;
            this.products.push(product);
            try {
               yield fs.promises.writeFile(this.path, JSON.stringify(this.products));
               return `The product "${product.title}" was added successfully.`;
            } catch (error) {
               return `An error occurred while adding the product`;
            }
         }
      });
   }
   getProduct(id) {
      return __awaiter(this, void 0, void 0, function* () {
         const data = yield fs.promises.readFile(this.path, 'utf-8');
         const products = JSON.parse(data);
         const productForId = products.find((p) => p.id === id);
         if (productForId) {
            return productForId;
         } else {
            return 'Product not found.';
         }
      });
   }
   getProducts() {
      return __awaiter(this, void 0, void 0, function* () {
         const data = yield fs.promises.readFile(this.path, 'utf-8');
         const products = JSON.parse(data);
         return products;
      });
   }
   updateProduct(id, updateData) {
      return __awaiter(this, void 0, void 0, function* () {
         const productIndex = this.products.findIndex((p) => p.id === id);
         if (productIndex !== -1) {
            const updatedProduct = Object.assign(Object.assign({}, this.products[productIndex]), updateData);
            this.products[productIndex] = updatedProduct;
            yield fs.promises.writeFile(this.path, JSON.stringify(this.products));
            return `The product "${updatedProduct.title}" was updated successfully.`;
         } else {
            return 'Product not found.';
         }
      });
   }
   deleteProduct(id) {
      return __awaiter(this, void 0, void 0, function* () {
         const index = this.products.findIndex((p) => p.id === id);
         if (index === -1) {
            return 'Product not found.';
         } else {
            const product = this.products[index];
            this.products.splice(index, 1);
            yield fs.promises.writeFile(this.path, JSON.stringify(this.products));
            return `The product "${product.title}" was deleted successfully.`;
         }
      });
   }
   deleteAll() {
      return __awaiter(this, void 0, void 0, function* () {
         this.products = [];
         yield fs.promises.writeFile(this.path, JSON.stringify(this.products));
         return `Products was deleted successful.`;
      });
   }
}
