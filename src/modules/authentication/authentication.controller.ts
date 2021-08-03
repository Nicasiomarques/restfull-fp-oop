import * as jwt from 'jsonwebtoken'
import { hash, compare } from 'bcrypt'
import { Request, Response, NextFunction, Router } from 'express'

import { User, UserModel } from '../user'
import { Controller } from '../../http/controller'
import { validatorMiddleware } from '../../middlewares'
import { UserCreateValidator, UserLoginValidator } from '.'
import { WrongCredentialsException, EmailUsedException } from '../../http/exceptions'

export interface DataStoredInToken { _id: string; }

export class AuthenticationController implements Controller {
  public path = '/auth'
  public router = Router()
  public user = UserModel

  constructor() {
    this.initializeRoutes()
  }

  private signToken(payload: DataStoredInToken) {
    const dataStoredInToken: DataStoredInToken = { _id: payload._id };
    return jwt.sign(
      dataStoredInToken,
      process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    })
  }

  private createSendToken(user: User, statusCode: number, response: Response) {
    const token = this.signToken(user)
    user.password = undefined;

    return response
      .cookie("authorization", token, { httpOnly: true, })
      .status(statusCode)
      .json({
        token,
        user
      })
  }

  private register = async (request: Request, response: Response, next: NextFunction) => {
    const userData: User = request.body
    if (await this.user.findOne({ email: userData.email })) {
      return next(new EmailUsedException(userData.email))
    }
    const hashedPassword = await hash(userData.password, 10)
    const newUser = await this.user.create({
      ...userData,
      password: hashedPassword,
    })
    this.createSendToken(newUser, 201, response)
  }

  private login = async (request: Request, response: Response, next: NextFunction) => {
    const userData: User = request.body
    const user = await this.user.findOne({ email: userData.email })
    if (!user || !(await compare(userData.password, user.password))) {
      return next(new WrongCredentialsException())
    }
    this.createSendToken(user, 200, response)
  }

  private logOut = (_: Request, response: Response) => {
    response.setHeader('Set-Cookie', ['authorization=;Max-age=0']);
    response.send(200);
  }

  public initializeRoutes() {
    this.router.post(`${this.path}/register`, validatorMiddleware(UserCreateValidator()), this.register)
    this.router.post(`${this.path}/login`, validatorMiddleware(UserLoginValidator()), this.login)
    this.router.post(`${this.path}/logout`, this.logOut)
  }
}