import { User } from "../user"
import * as Joi from "joi"

export const UserCreateValidator = (): Joi.Schema<User> =>
  Joi.object({
    name: Joi.string().trim().min(2).required(),
    password: Joi.string().min(6).required(),
    email: Joi.string().email().required(),
  })

export const UserLoginValidator = (): Joi.Schema<User> =>
  Joi.object({
    password: Joi.string().min(6).required(),
    email: Joi.string().email().required(),
  })