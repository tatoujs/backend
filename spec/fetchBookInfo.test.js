import fetchBookInfo from '../utils/fetchBookInfo'

describe('fetchBookInfo', () => {
    it('should return a book fetched', async () => {
        const goodIsbn = '9782266168540'
        const book = await fetchBookInfo(goodIsbn)

        expect(book).toBeDefined()
    })
})