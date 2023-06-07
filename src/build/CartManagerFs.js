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
export class CartManager {
   constructor(path, id, carts) {
      this.id = 0;
      this.carts = [];
      this.path = path + '.json';
      this.id = id !== null && id !== void 0 ? id : 0;
      this.carts = carts !== null && carts !== void 0 ? carts : [];
      // Checking if the .json file exists, else create it.
      if (fs.existsSync(this.path)) {
         const cartsJson = fs.readFileSync(this.path, 'utf-8');
         const cartsString = JSON.parse(cartsJson);
         this.carts = cartsString;
      } else {
         fs.writeFileSync(this.path, '[]');
         this.carts = [];
      }
   }
   addCart(cart) {
      return __awaiter(this, void 0, void 0, function* () {
         const newCart = {
            products: [],
            id: this.id,
         };
         const lastCart = this.carts[this.carts.length - 1];
         if (lastCart) {
            newCart.id = lastCart.id + 1;
         } else {
            newCart.id = 1;
         }
         newCart.products = cart.products;
         this.carts.push(newCart);
         yield fs.promises.writeFile(this.path, JSON.stringify(this.carts));
         return `The cart "${cart.id}" was added successfully.`;
      });
   }
   getCarts() {
      return __awaiter(this, void 0, void 0, function* () {
         return this.carts;
      });
   }
   getCartById(id) {
      return __awaiter(this, void 0, void 0, function* () {
         const cartForId = this.carts.find((p) => p.id === id);
         if (cartForId) {
            return cartForId;
         } else return 'Cart not found.';
      });
   }
   updateCart(id, updateData) {
      return __awaiter(this, void 0, void 0, function* () {
         const cartIndex = this.carts.findIndex((p) => p.id === id);
         if (cartIndex !== -1) {
            const updatedCart = Object.assign(Object.assign({}, this.carts[cartIndex]), updateData);
            this.carts[cartIndex] = updatedCart;
            yield fs.promises.writeFile(this.path, JSON.stringify(this.carts));
            return `The Cart "${updatedCart.id}" was updated successfully.`;
         } else {
            return 'Cart not found.';
         }
      });
   }
   deleteCart(id) {
      return __awaiter(this, void 0, void 0, function* () {
         const index = this.carts.findIndex((p) => p.id === id);
         if (index === -1) {
            return 'Cart not found.';
         } else {
            const cart = this.carts[index];
            this.carts.splice(index, 1);
            yield fs.promises.writeFile(this.path, JSON.stringify(this.carts));
            return `The product "${cart.id}" was deleted successfully.`;
         }
      });
   }
   deleteAll() {
      return __awaiter(this, void 0, void 0, function* () {
         this.carts = [];
         yield fs.promises.writeFile(this.path, JSON.stringify(this.carts));
         return `Carts was deleted successful.`;
      });
   }
}
