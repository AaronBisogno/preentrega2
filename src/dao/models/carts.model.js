import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
      products: { 
         type: [
            { 
               product: {
                  type: mongoose.Schema.Types.ObjectId, ref: 'products',
                  quantity: { type: Number, min: 1, default: 1 },
                  required: true
               } 
            }
         ],
         default: [],   
      },
   },
   { versionKey: false }
);

cartSchema.pre('find', function() {
   this.populate('products.product');
});

cartSchema.pre('findOne', function() {
   this.populate('products.product');
});

cartSchema.pre('findOneAndUpdate', function() {
   this.populate('products.product');
});

export const CartModel = mongoose.model('carts', cartSchema);
