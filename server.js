import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import https from 'https'
import sha1 from 'sha1'
import sha256 from 'sha256'
import convert from 'xml-js'
import { Isbn } from './utils/convertISBN/convert'
import utilFunctions from './utils/functions'
import request from 'ajax-request'
import Slack from 'slack-node'
import onesignal from 'simple-onesignal'
import helmet from 'helmet'
import ExpressBrute from 'express-brute'
import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'
import http from 'http'
import SocketIO from 'socket.io'
import Stripe from 'stripe'

// we load the db location from the JSON files
import config from 'config'

const app = express()

const server = http.Server(app)
const io = new SocketIO(server)

const port = 8080

// db options
const options = {
  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } },
}

// db connection
mongoose.connect(config.get('DBHost'), options)
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))

// Do not show logs when it is test
if (config.util.getEnv('NODE_ENV') !== 'test') {
    // use morgan to log at command line
    // 'combined' outputs the Apache style LOGs
    app.use(morgan('combined'))
}

// parse application/json and look for raw text
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.text())
app.use(bodyParser.json({ type: 'application/json' }))

app.set('port', (process.env.PORT || 5004))

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

app.get('/', (req, res) => res.json({ message: 'Welcome to Kimli !' }))

///////////// xxx ///////////////

app.route("/xxx")
  .get(async (req, res) => {
    try {
      const { limit } = req.query
      const books = await bookService.getBooks()

      res.json(books)
    } catch (e) {
      res.status(e.status)
      res.send(e.message)
    }
  })

app.route("/yyy")
  .get(async (req, res) => {
    try {
      const { id } = req.params
      const book = await bookService.getBook({ _id: id })
      res.json(book)
    } catch (e) {
      res.status(e.status)
      res.send(e.message)
    }
  })
//   .put(bookService.updateBook)

// ///////////// CHATS //////////////

// app.route("/chats")
//   .post(chatService.addChat)

// app.route("/chats/:userId")
//   .get(chatService.getChatsByUserId)
//   .put(chatService.updateChat)

//////////////////////////////////

app.listen(port)

console.log(`Magic is happening on port ${port}`)

// for testing
module.exports = app