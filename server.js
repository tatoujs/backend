const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const port = 8080;
const book = require('./controllers/routes/book');
const config = require('config'); //we load the db location from the JSON files
//db options
const options = {
    server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } }
};

//db connection
mongoose.connect(config.DBHost, options);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

//don't show the log when it is test
if(config.util.getEnv('NODE_ENV') !== 'test') {
    //use morgan to log at command line
    app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}

//parse application/json and look for raw text
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json'}));


app.get("/", (req, res) => res.json({message: "Welcome to Kimli !"}));


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