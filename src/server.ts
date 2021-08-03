import * as dotenv from 'dotenv'

import App from "./app";
import { validateEnv } from "./utils/valitateEnv";
import { PostController } from "./modules/Post/PostController";
import { AuthenticationController } from './modules/Authentication/AuthenticationController';

dotenv.config()
validateEnv()

const app = new App([
  new PostController(),
  new AuthenticationController()
])

app.run();