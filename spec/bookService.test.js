import sinon from 'sinon'
import bookService from '../services/bookService'
import Book from '../models/bookModel'
import CustomError from '../utils/errors'

describe('BookService', () => {
  let res, statusSpy, sendSpy, jsonSpy

  beforeAll(() => {
    res = {
      json: entityThatShouldBeReturned => {},
      status: statusPassed => {},
      send: message => {},
    }

    statusSpy = sinon.spy(res, "status")
    sendSpy = sinon.spy(res, "send")
    jsonSpy = sinon.spy(res, "json")
  })

  describe('getBooks()', () => {
    let execFunction, bookFindMethodStub

    beforeAll(() => {
      bookFindMethodStub = sinon.stub(Book, 'find').returns({
        limit: limitPassed => {
          return {
            exec: execFunction,
          }
        }
      })
    })

    it('should retrieve 11 books', async (done) => {
      const expected = Array(11).fill(new Book())
      const returnedBooksArray = Array(11).fill(new Book())

      execFunction = () => new Promise(resolve => {
        setTimeout(() => {
          resolve(returnedBooksArray)
        }, 2000)
      })

      const booksFound = await bookService.getBooks()

      expect(booksFound).toEqual(expected)
      done()
    })

    xit('should throw an error 500 when query exec fails', async () => {
      execFunction = () => new Promise(resolve, reject => {
        setTimeout(() => {
          throw new Error('something went wrong executing the query')
        }, 2000)
      })

      expect(await bookService.getBooks).toThrow()
      done()
    })
  })

  describe('getBook()', () => {
    // Not easy to test as there is not a lot of business logic
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