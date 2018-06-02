"use strict";

const Chat = require("../models/chatModel");
const ChatValidator = require("../utils/chatValidator");

let getChatsByUserId = (req, res) => {
    if(req.params.userId) {
        let userId = req.params.userId;
        let query = Chat.find().or([{ 'user1._id': userId }, { 'user2._id': userId }]);
        query.exec((err, chats) => {
           if(err){
               res.status(500);
               res.send(err);
           }
           console.log(chats);
           res.json(chats);
        });
    } else {
        res.status(400);
        res.send("No userId specified");
    }
};

let addChat = (req, res) => {
  if(ChatValidator.isValid(req.body)) {
      let chat = new Chat(req.body);
      chat.save((err, newChat) => {
          if(err) {
              res.status(500);
              res.send(err);
          }
          console.log(newChat);
          res.json(newChat);
      });
  } else {
      res.status(400);
      res.send("Invalid Chat object");
  }
};

module.exports = { getChatsByUserId, addChat };