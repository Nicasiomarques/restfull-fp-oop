import { HttpException } from "./httpException";

export class EmailUsedException extends HttpException {
  constructor(email: string) {
    super(409, `Email ${email} is already in use`)
  }
}