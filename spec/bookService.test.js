import sinon from 'sinon'
import bookService from '../services/bookService'
import Book from '../models/bookModel'
import CustomError from '../utils/errors'
import uuidv1 from 'uuid/v1'

describe('BookService', () => {
  let booksFindMethodStub, booksSaveMethodStub, booksDeleteOneMethodStub

  beforeAll(() => {
    booksFindMethodStub = sinon.stub(Book, 'find')
    // booksSaveMethodStub = sinon.stub(Book, 'save')
    // booksDeleteOneMethodStub = sinon.stub(Book, 'deleteOne')
  })

  afterEach(() => {
    booksFindMethodStub.reset()
    // booksSaveMethodStub.reset()
    // booksDeleteOneMethodStub.reset()
  })

  describe('getBooks()', () => {
    let execFunction

    beforeAll(() => {
      booksFindMethodStub.returns({
        limit: limitPassed => {
          return {
            exec: execFunction,
          }
        }
      })
    })

    it('should retrieve 11 books', async () => {
      const expected = Array(11).fill(new Book())
      const returnedBooksArray = Array(11).fill(new Book())

      execFunction = () => new Promise(resolve => {
        setTimeout(() => {
          resolve(returnedBooksArray)
        }, 2000)
      })

      const booksFound = await bookService.getBooks()

      expect(booksFound).toEqual(expected)
    })
  })

  describe('getBook()', () => {
    let _id, expectedBook

    beforeAll(() => {
      _id = uuidv1()

      booksFindMethodStub.returns(new Promise(resolve => {
        setTimeout(() => resolve(expectedBook), 2000)
      }))
    })

    it('should return a Book object matching the id', async () => {
      expectedBook = new Book({ _id })
      const book = await bookService.getBook({ _id })

      expect(book).toEqual(expectedBook)
    })

    it('should throw error if search fields are empty', async () => {
      const expectedError = {
        message: "empty search field",
        status: 400,
      }

      try {
        await bookService.getBook({})
      } catch (e) {
        expect(e).toEqual(expectedError)
      }
    })
  })

  describe('deleteBook()', () => {
    // Not easy to test as there is not a lot of business logic
  })

  describe('postBook()', () => {
    // Not easy to test as there is not a lot of business logic
  })

  describe('updateBook()', () => {
    // Not easy to test as there is not a lot of business logic
  })
})