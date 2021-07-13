import { Schema, Document, model } from 'mongoose'
import Post from './post.type'

const postSchema = new Schema({
  author: String,
  content: String,
  title: String,
})

export default model<Post & Document>('Post', postSchema)