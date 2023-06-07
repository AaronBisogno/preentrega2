import * as fs from 'fs';

interface Cart {
   products: [];
   id?: number;
}

export class CartManager {
   private path: string;
   public id: number = 0;
   public carts: Cart[] = [];

   constructor(path: string, id?: number, carts?: Cart[]) {
      this.path = path + '.json';
      this.id = id ?? 0;
      this.carts = carts ?? [];

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

   async addCart(cart: Cart) {
      const newCart: Cart = {
         products: [],
         id: this.id,
      };

      const lastCart = this.carts[this.carts.length - 1];
      if (lastCart) {
         newCart.id = lastCart.id! + 1;
      } else {
         newCart.id = 1;
      }

      newCart.products = cart.products;
      this.carts.push(newCart);

      await fs.promises.writeFile(this.path, JSON.stringify(this.carts));
      return `The cart "${cart.id}" was added successfully.`;
   }

   async getCarts() {
      const data = await fs.promises.readFile(this.path, 'utf-8');
      const carts = JSON.parse(data);
      return carts;
   }

   async getCart(id: number) {
      const data = await fs.promises.readFile(this.path, 'utf-8');
      const carts = JSON.parse(data) as Cart[];
      const cartForId = carts.find((p) => p.id === id);
      if (cartForId) {
         return cartForId;
      } else return 'Cart not found.';
   }

   async updateCart(id: number, updateData: []) {
      const cartIndex = this.carts.findIndex((p) => p.id === id);
      if (cartIndex !== -1) {
         const updatedCart = { ...this.carts[cartIndex], ...updateData };
         this.carts[cartIndex] = updatedCart;
         await fs.promises.writeFile(this.path, JSON.stringify(this.carts));
         return `The Cart "${updatedCart.id}" was updated successfully.`;
      } else {
         return 'Cart not found.';
      }
   }

   async deleteCart(id: number) {
      const index = this.carts.findIndex((p) => p.id === id);
      if (index === -1) {
         return 'Cart not found.';
      } else {
         const cart = this.carts[index];
         this.carts.splice(index, 1);
         await fs.promises.writeFile(this.path, JSON.stringify(this.carts));
         return `The product "${cart.id}" was deleted successfully.`;
      }
   }

   async deleteAll() {
      this.carts = [];
      await fs.promises.writeFile(this.path, JSON.stringify(this.carts));
      return `Carts was deleted successful.`;
   }
}
