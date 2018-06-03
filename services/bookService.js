"use strict";

const Book = require('../models/bookModel');

/*
 * GET /book route to retrieve all the books.
 */
let getBooks = (req, res) => {
    let limit = parseInt(req.query.limit);

    //Query the DB and if no errors, send all the books
    let query = Book.find({}) //put an offset
        .limit(limit || 20);

    query.exec((err, books) => {
        if(err) {
            res.status(500);
            res.send(err);
        }
        //If no errors, send them back to the client
        res.json(books);
    });
};

/*
 * POST /book to save a new book.
 */
let postBook = (req, res) => {
    //Creates a new book
    let newBook = new Book(req.body);
    //Save it into the DB.
    newBook.save((err,book) => {
        if(err) {
            res.send(err);
        }
        //If no errors, send it back to the client
        res.json({message: "Book successfully added!", book });
    });
};

/*
 * GET /book/:id route to retrieve a book given its id.
 */
let getBook = (req, res) => {
    Book.findById(req.params.id, (err, book) => {
        if(err) {
            res.status(500);
            res.send(err);
        }
        //If no errors, send it back to the client
        res.json(book);
    });
};

/*
 * DELETE /book/:id to delete a book given its id.
 */
let deleteBook = (req, res) => {
    Book.remove({_id : req.params.id}, (err, result) => {
        if(err) {
            res.status(500);
            res.send(err);
        } else {
            res.status(204);
            // TODO: VERIFY WELL 204 AND NOT 200 OTHERWISE ADD {}
            res.send();
        }
    });
};

/*
 * PUT /book/:id to update a a book given its id
 */
let updateBook = (req, res) => {
    Book.findById({_id: req.params.id}, (err, book) => {
        if(err){
            res.status(500);
            res.send(err);
        }
        Object.assign(book, req.body).save((err, book) => {
            if(err) {
                res.status(500);
                res.send(err);
            } else {
                res.status(204);
                // TODO: VERIFY WELL 204 AND NOT 200 OTHERWISE ADD {}
                res.send();
            }
        });
    });
};

//export all the functions.js
module.exports = { getBooks, postBook, getBook, deleteBook, updateBook };
