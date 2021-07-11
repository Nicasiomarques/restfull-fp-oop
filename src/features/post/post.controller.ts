import { Request, Response, Router } from 'express'
import Post from './post.type'

export default class PostController {
  public path = '/posts'
  public router = Router()

  private posts: Post[] = [
    {
      author: 'Nicasio Silva',
      content: 'lorem content lorem',
      title: 'My first post'
    }
  ]

  constructor() {
    this.initializeRoutes()
  }

  getAllPosts = (request: Request, response: Response) => {
    response.send(this.posts)
  }

  createPost = (request: Request, response: Response) => {
    const post: Post = request.body
    this.posts.push(post)
    response.send(post)
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllPosts)
    this.router.get(this.path, this.createPost)
  }
}