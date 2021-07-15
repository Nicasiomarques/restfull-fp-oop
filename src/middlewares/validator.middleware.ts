import * as Joi from "joi"
import { NextFunction, Request, Response } from "express"

import HttpException from "../http/exceptions/httpException";

const joiOptions = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true
};

export const validatorMiddleware = (schema: Joi.AnySchema) => {
  return (request: Request, response: Response, next: NextFunction) => {
    const { error, value } = schema.validate(request.body, joiOptions)

    if (error) {
      const message = error.details.map(error => error.message).join(', ')
      next(new HttpException(400, message))
    }

    request.body = value
    next()
  }
}