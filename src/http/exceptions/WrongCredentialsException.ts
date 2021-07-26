import HttpException from "./httpException";

export default class WrongCredentialsException extends HttpException {
  constructor() {
    super(400, `email or password incorrect.`)
  }
}