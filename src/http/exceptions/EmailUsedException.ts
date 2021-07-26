import HttpException from "./httpException";

export default class EmailUsedException extends HttpException {
  constructor(email: string) {
    super(409, `Email ${email} is already in use`)
  }
}