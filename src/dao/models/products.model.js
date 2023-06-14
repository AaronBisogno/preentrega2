import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
   title: { type: String, required: true, max: 100 },
   description: { type: String, required: true, max: 100 },
   code: { type: String, required: true, max: 100, unique: true },
   price: { type: Number, required: true },
   stock: { type: Number, required: true },
   category: { type: String, required: true, max: 100 },
   thumbnails: { type: String, required: false, max: 100 },
},

{ versionKey: false });

productSchema.plugin(mongoosePaginate)
export const ProductModel = mongoose.model('products', productSchema);
