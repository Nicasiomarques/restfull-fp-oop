import HttpException from "./httpException";

export default class PostNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Post not found with id ${id} not found`)
  }
}