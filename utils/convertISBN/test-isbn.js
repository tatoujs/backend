var Isbn = require('./convert').Isbn;

var conv = new Isbn('9782081214842');

console.log("ISBN : ",conv.formatIsbn("ISBN-10"));