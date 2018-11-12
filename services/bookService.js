import Book from '../models/bookModel'
import CustomError from '../utils/errors'
import _ from 'lodash'

/*
 * GET /books route to retrieve all the books.
 */
const getBooks = async (limit) => {
  // Query the DB and if no errors, send all the books
  const query = Book.find({}) // @TODO: put an offset
    .limit(limit || 20)

  const books = await query.exec()

  return books
}

/*
 * GET /books/:id route to retrieve a book given its id.
 */
const getBook = async (bookFields) => {
  if(_.isEmpty(bookFields)) {
    throw new CustomError(400, 'empty search field')
  }

  const book = await Book.find(bookFields)
  return book
}

/*
 * POST /books to save a new book.
 */
const postBook = (bookFields) => {
  const { isbn, userId } = bookFields

  // @TODO: add validators

  const book = getBook({ isbn })

  // Creates a new book
  // const newBook = new Book(bookFields)

  // Save it into the DB.
  newBook.save((err,book) => {
    if (err) {
      res.send(err)
    }

    // If no errors, send it back to the client
    res.json({message: 'Book successfully added!', book })
  })
}

/*
 * DELETE /books/:id to delete a book given its id.
 */
const deleteBook = (req, res) => {

    const { id } = req.params

    // @TODO: add validators

    Book.deleteOne({ _id : id }, (err, result) => {
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
