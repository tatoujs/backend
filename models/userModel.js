import mongoose from 'mongoose';

let Schema = mongoose.Schema

let UserSchema = new Schema({
   _id: { type: String, required: true },
   username: { type: String, required: true },
   password: { type: String, required: true },
}, { versionKey: false });

module.exports = mongoose.model('users', UserSchema)