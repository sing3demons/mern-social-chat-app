const { Schema, model } = require('mongoose')

const subMemberSchema = new Schema({
  senderId: { type: String },
  receiverId: { type: String },
  _id: false,
})

const ConversationSchema = new Schema(
  {
    members: { type: [] },
  },
  { timestamps: true }
)

module.exports = model('Conversation', ConversationSchema)
