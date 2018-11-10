import sinon from 'sinon'
import bookService from '../services/bookService'
import Book from '../models/bookModel'

xdescribe('BookService', () => {
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
    let execFunction, bookFindMethodStub, booksArray, req

    beforeAll(() => {
      booksArray = Array(11).fill(new Book())
      bookFindMethodStub = sinon.stub(Book, 'find').returns({
        limit: limitPassed => {
          return {
            exec: execFunction,
          }
        }
      })
      req = { query: { limit: 11 }}
    })

    beforeEach(() => {
      statusSpy.resetHistory()
      sendSpy.resetHistory()
      jsonSpy.resetHistory()
    })

    it('should retrieve 11 books', () => {
      execFunction = cb => cb(null, booksArray)

      bookService.getBooks(req, res)

      expect(jsonSpy.withArgs(booksArray).called).toBeTruthy()
      expect(sendSpy.notCalled).toBeTruthy()
      expect(statusSpy.notCalled).toBeTruthy()
    })

    it('should throw an error 500 when query exec fails', () => {
      execFunction = cb => cb(() => {}, null)

      bookService.getBooks(req, res)

      expect(statusSpy.called).toBeTruthy()
      expect(sendSpy.called).toBeTruthy()
      expect(jsonSpy.notCalled).toBeTruthy()
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