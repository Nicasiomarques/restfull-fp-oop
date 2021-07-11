import * as express from 'express'
import { curry, pipe, __ } from 'ramda'

const appInstance = express();

const makeServerWithJsonParser = curry((app = appInstance) => app.use(express.json()))

const makeServerWithControllers = curry((app: express.Application, controllers) => {
  controllers.forEach(controller => app.use('/', controller.router))
  return app
})

const makeServerWithPort = curry((app: express.Application, port: number) => app.listen(port))

export const makeApp = (controller, port: number) => pipe(
  makeServerWithJsonParser,
  makeServerWithControllers(__, controller),
  makeServerWithPort(__, port)
)()