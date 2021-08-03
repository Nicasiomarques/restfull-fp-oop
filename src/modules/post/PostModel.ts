import { Schema, Document, model } from 'mongoose'
import { Post } from './PostTypes'

const postSchema = new Schema({
  author: String,
  content: String,
  title: String,
})

export const PostModel = model<Post & Document>('Post', postSchema)