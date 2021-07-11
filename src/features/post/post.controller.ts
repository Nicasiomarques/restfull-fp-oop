import { Request, Response, Router } from 'express'
import Post from './post.type'

export default function PostController(path = '/posts', router = Router()) {
  const posts: Post[] = [
    {
      author: 'Nicasio Silva',
      content: 'lorem content lorem',
      title: 'My first post'
    }
  ]

  const getAllPosts = (request: Request, response: Response) => {
    response.send(posts)
  }

  const createPost = (request: Request, response: Response) => {
    const post: Post = request.body
    posts.push(post)
    response.send(post)
  }

  (() => {
    router.get(path, getAllPosts)
    router.get(path, createPost)
  })()

  return { router }
}