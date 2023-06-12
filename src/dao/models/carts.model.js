import { Schema, model } from 'mongoose';

const schema = new Schema(
   {
      products: { 
         type: [
            {
               product: {
                  type: Schema.Types.ObjectId,
                  ref: 'products',
               }
            }
         ],
         default: [],   
      },
   },
   { versionKey: false }
);

schema.pre('find', function() {
   this.populate('products.product')
})

schema.pre('findOne', function() {
   this.populate('products.product')
})

export const CartModel = model('carts', schema);
