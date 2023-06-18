const { Router } = require('express')
const router = Router()
const Conversation = require('../models/Conversation')

router.post('/', async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
    // members: [{ senderId: req.body.senderId, receiverId: req.body.receiverId }],
  })

  try {
    const savedConversation = await newConversation.save()
    res.status(200).json(savedConversation)
  } catch (err) {
    res.status(500).json(err)
  }
})

router.get('/:userId', async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    })
    // const { userId } = req.params
    // const conversation = await Conversation.find({
    //   members: { $elemMatch: { $or: [{ senderId: userId }, { receiverId: userId }] } },
    // })
    res.status(200).json(conversation)
  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = router
