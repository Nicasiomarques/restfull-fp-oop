import { Request, Response, Router } from 'express'

import Controller from '../../http/controller'
import postModel from './post.model'
import Post from './post.type'

export default class PostController implements Controller {
  public path = '/posts'
  public router = Router()
  private post = postModel

  constructor() {
    this.initializeRoutes()
  }

  createPost = async (request: Request, response: Response) => {
    const postData: Post = request.body
    const postCreated = new postModel(postData)
    await postCreated.save()
    response.json(postCreated)
  }

  getAllPosts = async (_: Request, response: Response) => {
    const posts: Post[] = await this.post.find()
    response.json(posts)
  }

  getPostById = async (request: Request, response: Response) => {
    const { id } = request.params
    const post = await this.post.findById(id)
    response.json(post)
  }

  modifyPost = async (request: Request, response: Response) => {
    const { id } = request.params
    const postData: Post = request.body
    const post = await this.post.findByIdAndUpdate(id, postData, { new: true })
    response.json(post)
  }

  deletePost = async (request: Request, response: Response) => {
    const { id } = request.params
    await this.post.findByIdAndRemove(id)
    response.status(204).json({})
  }

  public initializeRoutes() {
    this.router.route(this.path)
      .get(this.getAllPosts)
      .post(this.createPost)

    this.router.route(`${this.path}/:id`)
      .get(this.getPostById)
      .patch(this.modifyPost)
      .delete(this.deletePost)
  }
}