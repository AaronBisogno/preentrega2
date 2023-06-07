import { Schema, model } from 'mongoose';

const schema = new Schema({
   firstName: { type: String, required: true, max: 100 },
   lastName: { type: String, required: true, max: 100 },
   email: { type: String, required: true, max: 100, unique: true },
},
{ versionKey: false });

export const UserModel = model('users', schema);
