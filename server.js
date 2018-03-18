const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const port = 8080;
const book = require('./controllers/routes/book');
const config = require('config'); //we load the db location from the JSON files

const https = require('https');
const sha1 = require('sha1');
const sha256 = require('sha256');
const convert = require('xml-js');
const Isbn = require('./utils/convertISBN/convert').Isbn;
const utilFunctions = require('./utils/functions');
const request = require('ajax-request');
const Slack = require('slack-node');
const onesignal = require('simple-onesignal');
const helmet = require('helmet');
const ExpressBrute = require('express-brute');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const server = require('http').Server(app);
const io = require('socket.io')(server);


// db options
const options = {
    server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } }
};

// db connection
mongoose.connect(config.get("DBHost"), options);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// key to generate token for jwt secure connexions
const SYNCH_KEY = config.get("synch_key");

// configures push notifications service
onesignal.configure(config.get("one_signal_app_id"), config.get("one_signal_api_key"));

// configures Stripe payment service
const stripe = require("stripe")(config.get("stripeSecretKey"));

// configures nodemailer to send and receive mails on hello@kimli.fr
const transporter = nodemailer.createTransport({
    host:'smtp.office365.com',
    port:587,
    secure:false,
    tls: {
        ciphers:'SSLv3'
    },
    auth:{
        user:'hello@kimli.fr',
        pass:'/kimliKimli2/'
    }
});

// SHOULD PROBABLY BE REMOVED

// var credentials = {
//     IonicApplicationID : "06196fee",
//     IonicApplicationAPItoken : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwMzVmMzVjNS00ZmM3LTRjNGQtYjU0MC02ODc0ZDc0NGU2MmYifQ.8PWmRz3dE3s7DVr_QbCoig_ZPp_g_2yDdqQE3HF5IGk"
// };

const store = new ExpressBrute.MemoryStore();
const bruteforce = new ExpressBrute(store);

//don't show the log when it is test
if(config.util.getEnv('NODE_ENV') !== 'test') {
    //use morgan to log at command line
    app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}


// 11 modules that increase NodeJS app security
app.use(helmet());

//parse application/json and look for raw text
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json'}));

app.set('port', (process.env.PORT || 5004));

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Access-Control-Allow-Origin, Content-Type, Authorization, Content-Length, auth_token');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.disable('x-powered-by');

app.get("/", (req, res) => res.json({message: "Welcome to Kimli ! "}));

app.route("/book")
    .get(book.getBooks)
    .post(book.postBook);

app.route("/book/:id")
    .get(book.getBook)
    .delete(book.deleteBook)
    .put(book.updateBook);

app.listen(port);

console.log("Magic is happening on port " + port);

module.exports = app; // for testing