import { NextFunction, Request, Response, Router } from 'express'

import { Controller } from '../../http/controller'
import { PostNotFoundException } from '../../http/exceptions'
import { authMiddleware, validatorMiddleware } from '../../middlewares'
import { Post, PostSchemaValidator } from '.'
import { PostModel } from './PostModel'

export class PostController implements Controller {
  public path = '/posts'
  public router = Router()
  private post = PostModel

  constructor() {
    this.initializeRoutes()
  }

  private createPost = async (request: Request, response: Response) => {
    const postData: Post = request.body
    const postCreated = new PostModel(postData)
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
    response.status(204)
  }

  public initializeRoutes() {
    this.router.route(this.path)
      .get(this.getAllPosts)
      .get(this.getPostById)

    this.router
      .post(this.path, authMiddleware, validatorMiddleware(PostSchemaValidator()), this.createPost)
      .patch(`${this.path}/:id`, authMiddleware, validatorMiddleware(PostSchemaValidator(true)), this.modifyPost)
      .delete(`${this.path}/:id`, authMiddleware, this.deletePost)
  }
}