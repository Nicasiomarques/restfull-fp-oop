import * as express from 'express'
import * as mongoose from 'mongoose'
import * as dotenv from 'dotenv'

import Controller from './http/controller'
import globalErrorHandler from './middlewares/errorHandler.middleware'

dotenv.config()

class App {
  private app: express.Application

  constructor(controllers: Controller[]) {
    this.app = express()
    this.connectDatabase()
    this.initializeMiddlewares()
    this.initializeControllers(controllers)
    this.initializeErrorHandler()
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach(({ router }) => this.app.use('/', router))
  }

  private initializeMiddlewares() {
    this.app.use(express.json())
  }

  private connectDatabase() {
    const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env
    mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_PATH}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
  }

  private initializeErrorHandler() {
    this.app.use(globalErrorHandler)
  }

  public run() {
    this.app.listen(process.env.PORT, () => {
      console.log(`Aplication is running on port ${process.env.PORT}`)
    })
  }
}

export default App