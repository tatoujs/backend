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

app.route('/heroku/apps/:app_id/logs')
  .get(async (req, res) => {
    try {
      const userFields = req.params

      // SET SOCKET IO ROOM NAME
      // AND RESPOND OK WITH APP_ID

      const appObj = {}

      res.json(appObj)
    } catch (e) {
      res.status(500)
      res.send(e.message)
    }
  })
  .post(async (req, res) => {
    try {
      // Simply loging received body for now
      console.log(typeof req.body)

      res.json({ received: 'ok' })
    } catch (e) {
      res.status(500)
      res.send(e.message)
    }
  })

console.log(`Magic is happening on port ${port}`)

io.on('connection', (socket) => {
  socket.on('join-room', (username) => {
    socket.join(username)

    setInterval(() => {
      io.to(username).emit('log', {
        date: new Date().getTime(),
        type: 'just-a-log',
        text: `this is a log sent at ${new Date().getTime()}`,
      })
    }, 3000)
  })
})