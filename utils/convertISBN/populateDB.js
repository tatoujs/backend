var _this       = this;
var mongoClient = require('mongodb').MongoClient;
var fs          = require('fs');

_this.readALL = function ()
{
    fs.readFile('BX-Books.csv', "utf8", function (err, data) {
        _this.booksFile = data;
        _this.formatLine();
    });
}

_this.removeQuotes = function(str){
    if(str[0] == '"')
        str = str.substr(1,str.length-2)

    return str;
}
 
_this.formatLine = function ()
{
    _this.booksFile = _this.booksFile.split('\n');
   
   // var mongoURL = "mongodb://florian_master:kimliMaster2@ds143221.mlab.com:43221/heroku_5f2kn8gp";

   // var i=1;

    // setInterval(function(){

        // var line = _this.booksFile[i].split(';');
        
        console.log("LEN : ",_this.booksFile.length);
        
        // var Isbn = require('./convert').Isbn;

        // line[0] = _this.removeQuotes(line[0]);

        // var conv = new Isbn(line[0]);
        // var isbn13 = conv.formatIsbn("ISBN-13");

        // var book = {
        //     "_id": isbn13,
        //     "isbn13": isbn13,
        //     "isbn10": line[0],
        //     "title": _this.removeQuotes(line[1]),
        //     "author": _this.removeQuotes(line[2]),
        //     "publisher": _this.removeQuotes(line[4]),
        //     "published_year": _this.removeQuotes(line[3])
        // }
           
        // console.log("BOOK ",i,"\n",book,"\n");

        // mongoClient.connect(mongoURL, function(err, db){
        //     db.collection('books').save(book);
        // });

    //     i++;

    // }, 5000);

}
 
_this.readALL();