import axios from 'axios'

const fetchBookInfo = async (isbn) => {
    const results = await axios.all([
        fetchOnGoogle(isbn),
        fetchOnOpenLibrary(isbn),
        fetchOnApiCast(isbn),
    ])

    const resultsExploited = await axios.spread()

    console.log(resultsExploited)

    return resultsExploited[0]
}

const fetchOnGoogle = (isbn) => {
    return axios.get(`https://www.googleapis.com/books/v1/volumes?q=${isbn}`)
}

const fetchOnOpenLibrary = (isbn) => {
    return axios.get(`http://openlibrary.org/search.json?isbn=${isbn}`)
}

const fetchOnApiCast = (isbn) => {
    return axios.get(`https://api-2445581351187.apicast.io/search?q=${isbn}&app_id=6b28e17b&app_key=f77f3412eeb12fb9494b9feac6eed3c9`)
}

export default fetchBookInfo