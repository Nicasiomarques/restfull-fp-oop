import { NextFunction, Request, Response } from "express";
import { HttpException } from "../http/exceptions/httpException";

export function globalErrorHandler(error: HttpException, request: Request, response: Response, next: NextFunction) {
  const status = error.status || 500
  const message = error.message || 'Something went wrong'
  response.status(status).send({ status, message })
}