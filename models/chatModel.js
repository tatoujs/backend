"use strict";

const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let ChatChema = new Schema({
   _id: { type: String, required: true },
   exchangeIds: { type: Array, required: true },
   archive: { type: Boolean, required: true },
   user1: {
       _id: { type: String, required: true },
       firstname: { type: String, required: true },
       notifs: { type: Number, required: true }
   },
   user2: {
       _id: { type: String, required: true },
       firstname: { type: String, required: true },
       notifs: { type: Number, required: true }
   },
   messages: [{
       message: { type: String, required: true },
       userId: { type: String, required: true },
       firstname: { type: String, required: true }
   }],
   date: { type: Number, required: true }
}, { versionKey: false });

module.exports = mongoose.model('chat', ChatChema);