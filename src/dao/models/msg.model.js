import { Schema, model } from 'mongoose';

const schema = new Schema({
    msg: { type: String, required: true },
    email: { type: String, required: true, max: 100},
});

export const UserModel = model('messages', schema);