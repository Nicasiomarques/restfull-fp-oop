import * as dotenv from 'dotenv'

import App from "./app";
import validateEnv from "./utils/valitateEnv";
import PostController from "./features/post/post.controller";
import AuthenticationController from './features/authentication/authentication.controller';

dotenv.config()
validateEnv()

const app = new App([
  new PostController(),
  new AuthenticationController()
])

app.run();