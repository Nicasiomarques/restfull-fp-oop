import App from "./app";
import PostController from "./features/post/post.controller";

const app = new App([
  new PostController()
],
  5000
)

app.run();