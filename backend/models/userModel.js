import mongoose from 'mongoose';

let Schema = mongoose.Schema

let UserSchema = new Schema({
   _id: { type: String, required: true },
   username: { type: String, required: true },
   password: { type: String, required: true },
   heroku: { type: [String], required: false },
   aws: { type: [String], required: false },
}, { versionKey: false });

module.exports = mongoose.model('users', UserSchema)