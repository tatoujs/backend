"use strict";

const Chat = require("../models/chatModel");

let getChatsByUserId = (req, res) => {
    if(req.params.userId) {
        let userId = req.params.userId;
        let query = Chat.find().or([{ 'user1._id': userId }, { 'user2._id': userId }]);
        query.exec((err, chats) => {
           if(err){
               res.send(err);
           }
           console.log(chats);
           res.json(chats);
        });
    } else { // RIGHT ?????
        res.end();
    }
};

module.exports = { getChatsByUserId };