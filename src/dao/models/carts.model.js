import { Schema, model } from 'mongoose';

const schema = new Schema(
   {
      products: { type: Array, required: true },
   },
   { versionKey: false }
);

export const CartModel = model('carts', schema);
