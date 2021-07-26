import * as jwt from 'jsonwebtoken'
import { hash, compare } from 'bcrypt'
import { Request, Response, NextFunction, Router } from 'express'

import User from '../user/user.type'
import userModel from '../user/user.model'
import Controller from '../../http/controller'
import { validatorMiddleware } from '../../middlewares/validator.middleware'
import EmailUsedException from '../../http/exceptions/EmailUsedException'
import WrongCredentialsException from '../../http/exceptions/WrongCredentialsException'
import { UserCreateValidator, UserLoginValidator } from './authentication.validator'

export interface DataStoredInToken { _id: string; }

export default class AuthenticationController implements Controller {
  public path = '/auth'
  public router = Router()
  public user = userModel

  constructor() {
    this.initializeRoutes()
  }

  private createTokenAndSetCookie(user: User) {
    const dataStoredInToken: DataStoredInToken = { _id: user._id };
    const token = jwt.sign(
      dataStoredInToken,
      process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    })
    return token
  }

  private register = async (request: Request, response: Response, next: NextFunction) => {
    const userData: User = request.body
    if (await this.user.findOne({ email: userData.email })) {
      next(new EmailUsedException(userData.email))
    }
    const hashedPassword = await hash(userData.password, 10)
    const newUser = await this.user.create({
      password: hashedPassword,
      ...userData,
    })
    newUser.password = undefined
    response.json({
      token: this.createTokenAndSetCookie(newUser),
      newUser,
    })
  }

  private login = async (request: Request, response: Response, next: NextFunction) => {
    const userData: User = request.body
    const user = await this.user.findOne({ email: userData.email })
    if (!user || !(await compare(userData.password, user.password))) {
      next(new WrongCredentialsException())
    }
    user.password = undefined
    response.json({
      token: this.createTokenAndSetCookie(user),
      user,
    });
  }

  public initializeRoutes() {
    this.router.post(`${this.path}/register`, validatorMiddleware(UserCreateValidator()), this.register)
    this.router.post(`${this.path}/login`, validatorMiddleware(UserLoginValidator()), this.login)
  }
}