"use strict";

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//book schema definition
let BookSchema = new Schema(
    {
        _id: { type: String, required: true },
        isbn13: { type: String, required: true },
        isbn10: { type: String },
        title: { type: String, required: true },
        author: { type: String, required: true },
        publisher: { type: String },
        published_year: { type: String }
    },
    {
        versionKey: false
    }
);

//Exports the BookSchema for use elsewhere.
module.exports = mongoose.model('book', BookSchema);