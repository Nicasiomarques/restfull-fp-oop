import * as jwt from "jsonwebtoken"
import { NextFunction, Response } from "express"

import userModel from "../features/user/user.model"
import { RequestWithUser } from "../features/user/user.type"
import WrongAuthTokenException from "../http/exceptions/WrongAuthTokenException"
import { DataStoredInToken } from "../features/authentication/authentication.controller"
import AuthTokenMissingException from "../http/exceptions/AuthTokenMissingException"

export const authMiddleware = async (request: RequestWithUser, _: Response, next: NextFunction) => {
  if (!request?.headers?.authorization) next(new AuthTokenMissingException())
  const token = request?.headers?.authorization?.replace('Bearer ', '').trim()
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET) as DataStoredInToken
    const user = await userModel.findById({ _id: decode._id })
    if (!user) next(new WrongAuthTokenException())
    request.user = user
    next()
  } catch (error) {
    next(new WrongAuthTokenException())
  }
}