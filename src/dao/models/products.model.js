import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, max: 50 },
        description: { type: String, required: true, max: 500 },
        code: { type: String, required: true, max: 15, unique: true },
        price: { type: Number, required: true },
        stock: { type: Number, required: true },
        category: { type: String, required: true, enum: ['Technology', 'Electrodomestics', 'House', 'Tools', 'Sports', 'Vehicles'] },
        thumbnails: { type: String, required: false, max: 100 },
    },

    { versionKey: false }
);

productSchema.plugin(mongoosePaginate);
export const ProductModel = mongoose.model('products', productSchema);
