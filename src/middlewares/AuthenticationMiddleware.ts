import * as jwt from "jsonwebtoken"
import { NextFunction, Response } from "express"

import { RequestWithUser, UserModel } from "../modules/User"
import { DataStoredInToken } from "../modules/Authentication"
import { AuthTokenMissingException, WrongAuthTokenException } from "../http/exceptions"

export const authMiddleware = async (request: RequestWithUser, _: Response, next: NextFunction) => {
  const token = request?.cookies?.authorization
  if (!token) next(new AuthTokenMissingException())
  try {
    const userData = jwt.verify(token, process.env.JWT_SECRET) as DataStoredInToken
    const user = await UserModel.findById({ ...userData })
    if (!user) next(new WrongAuthTokenException())
    request.user = user
    return next()
  } catch (error) {
    return next(new WrongAuthTokenException())
  }
}