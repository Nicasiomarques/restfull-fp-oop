import * as mongoose from 'mongoose';
import { User } from './user.type';

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

export const UserModel = mongoose.model<User & mongoose.Document>('User', userSchema);