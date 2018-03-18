const sha256 = require('sha256');

module.exports.secureIdHash = () => {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( let i=0; i < 10; i++ ){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return sha256(text);
};

module.exports.generateNewPassword = () => {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for(let i=0; i < 12; i++){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
};

module.exports.generatePromo = () => {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for(let i=0; i < 5; i++){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
};

module.exports.newPasswordGen = (pass, cb=null) => {
    if(cb){
        cb(sha256(sha256(pass).toUpperCase()).toUpperCase())
    }else{
        return sha256(sha256(pass).toUpperCase()).toUpperCase()
    }
};

module.exports.getEmailFromId = (otherId, cb) => {
    console.log("EMAIL FROM ID: ",otherId);
    //Connect to the db
    MongoClient.connect(mongoURL, function (err, db) {
        if(err){
            console.log("ERROR: ",err);
            cb(err, result[0].email)
        }else{
            db.collection('users').find({'_id':otherId}).toArray(function(error,result){
                if(error){
                    console.log("ERROR: ",error);
                    cb(error, result[0].email)
                }else{
                    console.log(result);
                    cb(false, result[0].email)
                }
            });
        }
    });
};

module.exports.generateOwnedBookId = (isbn,userId) => {
    return (userId+isbn);
};

module.exports.addOneToken = (userId) => {
    //Connect to the db
    MongoClient.connect(mongoURL, function (err, db) {
        if(err){
            console.log("ERROR: ",err);
        }else{

            db.collection('users').find({'_id':userId}).toArray(function(error,result){
                let tokens = result[0].tokens;
                tokens++;
                db.collection('users').update({'_id':userId},{'$set':{'tokens':tokens}});
            });
        }

    });
};

module.exports.addTokens = (userId, number, cb) => {
    //Connect to the db
    MongoClient.connect(mongoURL, function (err, db) {
        if(err){
            console.log("ERROR: ",err);
            cb(err);
        }else{

            db.collection('users').find({'_id':userId}).toArray(function(error,result){
                if(error){
                    console.log("ERROR: ",err);
                    cb(err);
                }

                let tokens = result[0].tokens;
                tokens += number;

                db.collection('users').update({'_id':userId},{'$set':{'tokens':tokens}}).then(function(){
                    cb(false);
                });
            });
        }
    });
};

module.exports.removeOneToken = (userId) => {
    //Connect to the db
    MongoClient.connect(mongoURL, function (err, db) {
        if(err){
            console.log("ERROR: ",err);
        }else{

            db.collection('users').find({'_id':userId}).toArray(function(error,result){
                if(error){
                    console.log("ERROR: ",error);
                }else{
                    let tokens = result[0].tokens;
                    tokens--;
                    db.collection('users').update({'_id':userId},{'$set':{'tokens':tokens}});
                }
            });
        }

    });
};

module.exports.createChat = (user1,user2,exchangeId) => {
    let firstuser = {'_id':user1._id,'firstname':user1.firstname};
    let seconduser = {'_id':user2._id,'firstname':user2.firstname};
    let newExchange;
    let message;

    let id = secureIdHash();
    //Connect to the db
    MongoClient.connect(mongoURL, function (err, db) {
        if(err){
            console.log("ERROR: ",err);
        }else{
            db.collection('chats').find({'$or':[{'user1._id':firstuser._id,'user2._id':seconduser._id},{'user2._id':firstuser._id,'user1._id':seconduser._id}]}).toArray(function(err, resp1){
                db.collection('exchanges').find({'_id':exchangeId}).toArray(function(err, resp2){
                    if(resp2[0].bookToExchange){
                        message = resp2[0].bookToExchange.title+" contre "+resp2[0].bookOffered.title;
                    }else{
                        message = resp2[0].bookOffered.title+" en échange";
                    }

                    newExchange = {"message": message,"userId":"Kimli","firstname": "Kimli"};

                    let date = (new Date()).getTime()+604800000;

                    if(resp1.length > 0){
                        let chatId = resp1[0]._id;
                        db.collection('chats').update({'_id':chatId}, {'$push':{'messages':newExchange,'exchangeIds':exchangeId}, '$set':{'date':date}})
                    }else{
                        db.collection('chats').save({'_id':id,'exchangeIds':[exchangeId],'archive':false,'user1':firstuser,'user2':seconduser,'messages':[newExchange],'date':date});
                    }
                });
            })
        }
    });
};

module.exports.addBookToLibrary = (isbn,book,api,userId,cb) => {
    let bookToAdd = {};

    if(isbn.length !== 13){
        isbn = new Isbn(isbn).formatIsbn("ISBN-13");
    }

    if(api === "openLibrary"){
        bookToAdd._id = isbn;
        bookToAdd.isbn10 = new Isbn(isbn).formatIsbn("ISBN-10");
        bookToAdd.isbn13 = isbn;
        bookToAdd.title = book.title;
        bookToAdd.author = book.author_name[0] || "";
        bookToAdd.publisher = book.publisher[0] || "";
        bookToAdd.published_year = book.first_publish_year || "";
    }
    else if(api === "isbndb"){
        bookToAdd._id = isbn;
        bookToAdd.isbn13 = isbn;
        bookToAdd.isbn10 = new Isbn(isbn).formatIsbn("ISBN-10");
        bookToAdd.title = book.title;
        bookToAdd.author = (book.author_data ? book.author_data[0].name : "");
        bookToAdd.publisher = book.publisher_id || "";
        bookToAdd.published_year = "";
    }
    else if(api === "apicast"){
        bookToAdd._id = isbn;
        bookToAdd.isbn13 = isbn;
        bookToAdd.isbn10 = new Isbn(isbn).formatIsbn("ISBN-10");
        bookToAdd.title = book.title._text;
        bookToAdd.author = book.author._text || "";
        bookToAdd.publisher = book.publisher._text || "";
        bookToAdd.published_year = book.published_year._text || "";
    }
    else if(api === "google"){
        bookToAdd._id = isbn;
        bookToAdd.isbn13 = isbn;
        try {
            bookToAdd.isbn10 = new Isbn(isbn).formatIsbn("ISBN-10");
        } catch(e) {
            console.log(e);
        }
        bookToAdd.title = book.title || "";
        bookToAdd.author = (book.authors ? book.authors[0] : "");
        bookToAdd.publisher = (book.publisher ? book.publisher : "");
        bookToAdd.published_year = book.publishedDate || "";
    }

    //Connect to the db
    MongoClient.connect(mongoURL, function (err, db) {
        if(err){
            console.log("ERROR: ",err);
            cb(false, false);
        }else{
            db.collection('books').save(bookToAdd).then(function(res,err){
                if(err){
                    console.log("ERROR: ",err);
                    cb(false, false);
                }else{
                    console.log("NEW BOOK ADDED INTO LIBRARY");

                    if(userId.length > 3){
                        return cb(false, true);
                    }
                }
            });
        }
    });
};

module.exports.getBookDetails = (isbn,userId,cb) => {

    // Query the book database by ISBN code.
    userId = userId.toString();
    let found = false;
    let i=0;

    let url = [
        "http://openlibrary.org/search.json?isbn="+isbn,
        "https://api-2445581351187.apicast.io/search?q="+isbn+"&app_id=6b28e17b&app_key=f77f3412eeb12fb9494b9feac6eed3c9",
        "https://www.googleapis.com/books/v1/volumes?q="+isbn
    ];

    console.log("SEARCHING FOR "+isbn);

    request({ // request on openlibrary
        url: url[i],
        json:true,
        timeout:5000
    }, function (error, response, body) {
        console.log(i+" SEARCHING ON ::: "+url[i]);
        if(error || !body || body.numFound === 0 || body.num_found === 0){
            console.log("Not found on "+url[i]);
            i++;
            request({ //request on apicast
                url: url[i],
                json:true,
                timeout:5000
            }, function (error, response, body) {
                let result1;

                try{
                    result1 = JSON.parse(convert.xml2json(body, {compact: true, spaces: 4}));
                }catch(err){
                    console.log(err);
                }

                console.log(i+" SEARCHING ON ::: "+url[i]);

                if(result1 && result1.response.page.results.book){
                    console.log("FOUND ON "+url[i]);
                    addBookToLibrary(isbn,result1.response.page.results.book,'apicast',userId,cb);
                }
                else{
                    console.log("Not found on "+url[i]);

                    i++;
                    https.get(url[i], (res) => { // request on Google

                        console.log(i+" SEARCHING ON ::: "+url[i]);

                        let body = "";

                        res.on('data', (d) => {
                            body += d;
                        });

                        res.on("end", () => {
                            body = JSON.parse(body);

                            if(body.totalItems === 0){
                                console.log("NOT FOUND ON "+url[i]);
                                return cb(false, false);
                            }else if(body.totalItems > 0){
                                console.log("FOUND ON "+url[i]);
                                addBookToLibrary(isbn,body.items[0].volumeInfo,'google',userId,cb);
                            }else if(body.error){
                                console.log(body.error);
                                console.log("NOT FOUND ON "+url[i]);
                                return cb(false, false);
                            }
                        });
                    });
                }
            });
        }
        else{
            console.log("FOUND ON "+url[i]);
            addBookToLibrary(isbn,body.docs[0],'openLibrary',userId,cb);
        }
    });
};