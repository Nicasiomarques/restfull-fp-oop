import * as joi from 'joi'
import { Post } from './PostTypes'

export const PostSchemaValidator = (allowMissingProps = false): joi.Schema<Post> =>
  joi.object({
    title: allowMissingProps ?
      joi.string().trim() :
      joi.string().trim().required(),

    author: allowMissingProps ?
      joi.string() :
      joi.string().required(),

    content: allowMissingProps ?
      joi.string() :
      joi.string().required(),
  })