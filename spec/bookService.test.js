import sinon from 'sinon'
import bookService from '../services/bookService'
import Book from '../models/bookModel'
import CustomError from '../utils/errors'
import uuidv1 from 'uuid/v1'

describe('BookService', () => {
  let booksFindMethodStub, booksSaveMethodStub, booksDeleteOneMethodStub

  beforeAll(() => {
    booksFindMethodStub = sinon.stub(Book, 'find')
    // Book object seems to be created dynamically and save is not an "own property"
    booksSaveMethodStub = sinon.stub(Book.prototype, 'save')
    // booksDeleteOneMethodStub = sinon.stub(Book.prototype, 'deleteOne')
  })

  afterEach(() => {
    booksFindMethodStub.reset()
    booksSaveMethodStub.reset()
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

  xdescribe('postBook()', () => {
    let expectedResult, expectedBook

    beforeAll(() => {
      // @TODO
      // Given arguments, return different values
      // And stub find method

      booksFindMethodStub.returns(new Promise(resolve => {
        setTimeout(() => resolve(expectedBook), 2000)
      }))

      booksSaveMethodStub.returns(new Promise(resolve => {
        setTimeout(() => resolve(expectedResult), 2000)
      }))
    })

    it('should save and return an object containing the saved object and a message when book already exists', async () => {
      const bookToSave = { isbn13: '9782266168540' }
      expectedBook = {
        _id: '9782747027373',
        isbn13: '9782747027373',
        isbn10: '',
        title: 'Le secret de Léonard de Vinci',
        author: 'Mary Pope Osborne',
        publisher: '',
        published_year: '2009-06-25'
      }

      expectedResult = {
        message: 'Book successfully added!',
        book: expectedBook,
      }

      const result = await bookService.postBook(bookToSave)

      expect(result).toEqual(expectedResult)
    })
  })

  describe('updateBook()', () => {
    // Not easy to test as there is not a lot of business logic
  })
})