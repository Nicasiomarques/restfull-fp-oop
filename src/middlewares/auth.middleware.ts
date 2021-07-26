import * as jwt from "jsonwebtoken"
import { NextFunction, Response } from "express"

import { DataStoredInToken } from "../features/authentication"
import { RequestWithUser, UserModel } from "../features/user"
import { AuthTokenMissingException, WrongAuthTokenException } from "../http/exceptions"

export const authMiddleware = async (request: RequestWithUser, _: Response, next: NextFunction) => {
  if (!request?.headers?.authorization) next(new AuthTokenMissingException())
  const token = request?.headers?.authorization?.replace('Bearer ', '').trim()
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET) as DataStoredInToken
    const user = await UserModel.findById({ _id: decode._id })
    if (!user) next(new WrongAuthTokenException())
    request.user = user
    next()
  } catch (error) {
    next(new WrongAuthTokenException())
  }
}