import { HttpException } from "./httpException";

export class AuthTokenMissingException extends HttpException {
  constructor() {
    super(401, `Token de autenticação não fornecido.`)
  }
}