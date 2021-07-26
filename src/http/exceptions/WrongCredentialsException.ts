import { HttpException } from "./httpException";

export class WrongCredentialsException extends HttpException {
  constructor() {
    super(400, `email or password incorrect.`)
  }
}