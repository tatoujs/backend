import Book from '../models/bookModel'

/*
 * GET /books route to retrieve all the books.
 */
const getBooks = (req, res) => {
    const limit = parseInt(req.query.limit)

    // Query the DB and if no errors, send all the books
    const query = Book.find({}) // @TODO: put an offset
        .limit(limit || 20)

    query.exec((err, books) => {
        if (err) {
            res.status(500)
            res.send(err)
        } else {
            // If no errors, send them back to the client
            res.json(books)
        }
    })
}

/*
 * POST /books to save a new book.
 */
const postBook = (req, res) => {
    const bookFields = req.body

    // @TODO: add validators

    // Creates a new book
    const newBook = new Book(bookFields)

    // Save it into the DB.
    newBook.save((err,book) => {
        if (err) {
            res.send(err)
        }
        // If no errors, send it back to the client
        res.json({message: "Book successfully added!", book })
    })
}

/*
 * GET /books/:id route to retrieve a book given its id.
 */
const getBook = (req, res) => {
    const { id } = req.params

    Book.findById(id, (err, book) => {
        if (err) {
            res.status(500)
            res.send(err)
        }
        // If no errors, send it back to the client
        res.json(book)
    })
}

/*
 * DELETE /books/:id to delete a book given its id.
 */
const deleteBook = (req, res) => {

    const { id } = req.params

    // @TODO: add validators

    Book.remove({ _id : id }, (err, result) => {
        if (err) {
            res.status(500)
            res.send(err)
        } else {
            res.status(204)
            // @TODO: VERIFY WELL 204 AND NOT 200 OTHERWISE ADD {}
            res.send()
        }
    })
}

/*
 * PUT /books/:id to update a a book given its id
 */
const updateBook = (req, res) => {
    const bookFieldsToUpdate = req.body
    const { id } = req.params

    Book.findById({ _id: id }, (err, book) => {
        if (err) {
            res.status(500)
            res.send(err)
        } else {
            Object.assign(book, bookFieldsToUpdate).save((err, book) => {
                if (err) {
                    res.status(500)
                    res.send(err)
                } else {
                    res.status(204)
                    // @TODO: VERIFY WELL 204 AND NOT 200 OTHERWISE ADD {}
                    res.send()
                }
            })
        }
    })
}

// Export all the functions.js
module.exports = { getBooks, postBook, getBook, deleteBook, updateBook }
