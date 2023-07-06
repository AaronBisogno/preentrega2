import mongoose from 'mongoose';

const schema = new mongoose.Schema(
    {
        firstName: { type: String, required: true, max: 100 },
        lastName: { type: String, required: true, max: 100 },
        email: { type: String, required: true, max: 100, unique: true },
        age: { type: Number, required: true },
        birth: { type: String, required: true },
        password: { type: String, required: true },
        isAdmin: { type: Boolean, required: true, default: false },
        cart: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'carts',
            required: true,
        },
    },
    { versionKey: false }
);

schema.pre('find', function () {
    this.populate('cart.product');
});

schema.pre('findOne', function () {
    this.populate('cart.product');
});

schema.pre('findOneAndUpdate', function () {
    this.populate('cart.product');
});

export const UserModel = mongoose.model('users', schema);
