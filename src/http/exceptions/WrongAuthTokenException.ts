import HttpException from "./httpException";

export default class WrongAuthTokenException extends HttpException {
  constructor() {
    super(401, `Token de authenticação invalido`)
  }
}