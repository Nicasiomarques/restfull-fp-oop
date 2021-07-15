import { NextFunction, Request, Response, Router } from 'express'

import Post from './post.type'
import postModel from './post.model'
import Controller from '../../http/controller'
import { PostSchemaValidator } from './post.validators'
import { validatorMiddleware } from '../../middlewares/validator.middleware'
import PostNotFoundException from '../../http/exceptions/PostNotFoundException'

export default class PostController implements Controller {
  public path = '/posts'
  public router = Router()
  private post = postModel

  constructor() {
    this.initializeRoutes()
  }

  private createPost = async (request: Request, response: Response) => {
    const postData: Post = request.body
    const postCreated = new postModel(postData)
    await postCreated.save()
    response.json(postCreated)
  }

  private getAllPosts = async (_: Request, response: Response) => {
    const posts: Post[] = await this.post.find()
    response.json(posts)
  }

  private getPostById = async (request: Request, response: Response, next: NextFunction) => {
    const { id } = request.params
    const post = await this.post.findById(id)
    if (!post) next(new PostNotFoundException(id))
    response.json(post)
  }

  private modifyPost = async (request: Request, response: Response, next: NextFunction) => {
    const { id } = request.params
    const postData: Post = request.body
    const post = await this.post.findByIdAndUpdate(id, postData, { new: true })
    if (!post) next(new PostNotFoundException(id))
    response.json(post)
  }

  private deletePost = async (request: Request, response: Response, next: NextFunction) => {
    const { id } = request.params
    const deleted = await this.post.findByIdAndRemove(id)
    if (!deleted) next(new PostNotFoundException(id))
    response.status(204).json({})
  }

  public initializeRoutes() {
    this.router.route(this.path)
      .get(this.getAllPosts)
      .post(validatorMiddleware(PostSchemaValidator()), this.createPost)

    this.router.route(`${this.path}/:id`)
      .get(this.getPostById)
      .patch(validatorMiddleware(PostSchemaValidator(true)), this.modifyPost)
      .delete(this.deletePost)
  }
}