import Chat from '../models/chatModel'
import ChatValidator from '../utils/chatValidator'

const getChatsByUserId = (req, res) => {
  const { userId } = req.params

  if (userId) {
    const query = Chat.find().or([{ 'user1._id': userId }, { 'user2._id': userId }])

    query.exec((err, chats) => {
      if (err) {
        res.status(500)
        res.send(err)
      } else {
        res.json(chats)
      }
    })
  } else {
    res.status(400)
    res.send("no userId specified")
  }
}

const addChat = (req, res) => {
  if (ChatValidator.isValid(req.body)) {
    const chat = new Chat(req.body)

    chat.save((err, newChat) => {
      if (err) {
        res.status(500)
        res.send(err)
      }

      res.json(newChat)
    })
  } else {
    res.status(400)
    res.send("invalid Chat object")
  }
}

const updateChat = (req, res) => {
  const { _id } = req.params
  const chatFieldsToUpdate = req.body

  Chat.findById({ _id }, (err, chat) => {
    if (err) {
      res.status(500)
      res.send(err)
    } else if (!chat) {
      res.status(404)
      res.send("wrong chat id")
    } else {
      Object.assign(chat, chatFieldsToUpdate).save((err, chatUpdated) => {
        if (err) {
          res.status(500)
          res.send(err)
        } else {
          res.status(204)
          // TODO: VERIFY WELL 204 AND NOT 200 OTHERWISE ADD {}
          res.send()
        }
      })
    }
  })
}

const deleteChat = (req, res) => {
  const { _id } = req.params

  Chat.remove({ _id }, (err, result) => {
    if (err) {
      res.status(500)
      res.send(err)
    } else {
      res.status(204)
      // TODO: VERIFY WELL 204 AND NOT 200 OTHERWISE ADD {}
      res.send()
    }
  })
}

module.exports = { getChatsByUserId, addChat, updateChat, deleteChat }