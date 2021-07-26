import * as mongoose from 'mongoose';
import User from './user.type';

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

export default mongoose.model<User & mongoose.Document>('User', userSchema);
