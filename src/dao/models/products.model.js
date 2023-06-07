import { Schema, model } from 'mongoose';

const schema = new Schema({
   title: { type: String, required: true, max: 100 },
   description: { type: String, required: true, max: 100 },
   code: { type: String, required: true, max: 100, unique: true },
   price: { type: Number, required: true, max: 100 },
   stock: { type: Number, required: true, max: 100 },
   category: { type: String, required: true, max: 100 },
   thumbnails: { type: String, required: false, max: 100 },
});

export const ProductModel = model('products', schema);
