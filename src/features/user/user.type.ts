import { Request } from 'express';

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
}

export interface RequestWithUser extends Request {
  user: User;
}