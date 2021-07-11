import { makeApp } from "./app";
import PostController from "./features/post/post.controller";

makeApp([
  PostController()
],
  5000
)