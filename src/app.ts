import * as express from 'express'

class App {
  public app: express.Application
  public port: number

  constructor(controllers, port) {
    this.app = express()
    this.port = port

    this.initializeMiddlewares()
    this.initializeControllers(controllers)
  }

  public initializeControllers(controllers) {
    controllers.forEach(controller => {
      this.app.use('/', controller.router)
    })
  }

  public initializeMiddlewares() {
    this.app.use(express.json())
  }

  public run() {
    this.app.listen(this.port, () => {
      console.log(`Aplication is running on port ${this.port}`)
    })
  }
}

export default App