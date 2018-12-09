import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import http from 'http'
import SocketIO from 'socket.io'
import Dotenv from 'dotenv'
import userService from './services/user'
import herokuService from './services/heroku'

const app = express()
new Dotenv.load()

const port = process.env.PORT || 8080

const server = app.listen(port)
const io = new SocketIO(server)

io.on('connection', (socket) => {
  socket.on('join-room', (appId) => {
    socket.join(appId)
  })
})

const sendLog = (appId, log) => {
  console.log(`sending log to ${appId}`)
  io.to(appId).emit('log', {
    text: log,
  })
}

// db options
const options = {
  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } },
}

// db connection
mongoose.connect(process.env.DBHOST, options)
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))

// parse application/json and look for raw text
// app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.text())
app.use(bodyParser.raw({ type: ['application/logplex-1'] }))
app.use(bodyParser.json({ type: ['application/json'] }))

app.set('port', (port || 5004))

app.use((req, res, next) => {
  // website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*')

  // request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST')

  // request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Access-Control-Allow-Origin, Content-Type, Authorization, Content-Length, auth_token')

  // set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true)

  // pass to next layer of middleware
  next()
})

app.disable('x-powered-by')

app.get('/', (req, res) => res.json({ message: 'Welcome to TatouJS !' }))

///////////// USER ///////////////

app.route("/users/:_id")
  .get(async (req, res) => {
    try {
      const userFields = req.params
      const user = await userService.get(userFields)

      res.json(user)
    } catch (e) {
      res.status(e.status)
      res.send(e.message)
    }
  })
  .post(async (req, res) => {
    try {
      const userFields = req.body
      await userService.save(userFields)

      res.send(userFields)
    } catch (e) {
      res.status(500)
      res.send(e.message)
    }
  })

///////////// HEROKU ///////////////

app.route("/heroku/login")
  .post(async (req, res) => {
    try {
      const herokuLoginFields = req.body
      const result = await herokuService.login(herokuLoginFields)

      res.json(result)
    } catch (e) {
      res.status(500)
      res.send(e.message)
    }
  })

app.route('/heroku/apps/drains')
  .post(async (req, res) => {
    try {
      const appId = req.body.app_id
      const auth = req.headers.authorization
      let result = null

      const existingDrains = await herokuService.getDrains(appId, auth)

      if (existingDrains) {
        result = { drains: existingDrains }
      } else {
        result = await herokuService.createDrain(appId, auth)
      }

      res.json(result)
    } catch (e) {
      res.status(500)
      res.send(e.message)
    }
  })

app.route('/heroku/apps/:app_id/logs')
  .post(async (req, res) => {
    try {
      const appId = req.params.app_id

      // Simply loging received body for now
      const buf = Buffer.from(req.body)

      // Send log line to socket io room
      sendLog(appId, buf.toString())

      res.json({ received: 'ok' })
    } catch (e) {
      res.status(500)
      res.send(e.message)
    }
  })

console.log(`Magic is happening on port ${port}`)