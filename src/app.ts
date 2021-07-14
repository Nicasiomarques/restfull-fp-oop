import * as express from 'express'
import * as mongoose from 'mongoose'
import * as dotenv from 'dotenv'

import Controller from './http/controller'
import globalErrorHandler from './middlewares/errorHandler.middleware'

dotenv.config()

class App {
  public app: express.Application

  constructor(controllers) {
    this.app = express()

    this.connectDatabase()
    this.initializeMiddlewares()
    this.initializeControllers(controllers)
  }

  public initializeControllers(controllers: Controller[]) {
    controllers.forEach(({ router }) => this.app.use('/', router))
  }

  public initializeMiddlewares() {
    this.app.use(globalErrorHandler)
    this.app.use(express.json())
  }

  public connectDatabase() {
    const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env

    mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_PATH}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true
    })
  }

  public run() {
    this.app.listen(process.env.PORT, () => {
      console.log(`Aplication is running on port ${process.env.PORT}`)
    })
  }
}

export default App