import * as mongoose from 'mongoose';
import { User } from './UserTypes';

const addressSchema = new mongoose.Schema({
  street: String,
  city: String
})

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  address: addressSchema
});

export const UserModel = mongoose.model<User & mongoose.Document>('User', userSchema);