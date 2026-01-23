const Message = require('../models/Message')
const Match = require('../models/Match')

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const { matchId, content } = req.body
    const senderId = req.user._id

    // Verify user is part of the match
    const match = await Match.findById(matchId)
    if (!match || !match.users.some(user => user.equals(senderId))) {
      return res.status(403).json({ message: 'Not authorized for this match' })
    }

    const message = new Message({
      match: matchId,
      sender: senderId,
      content
    })

    await message.save()
    await message.populate('sender', 'name')

    res.status(201).json(message)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get messages for a match
exports.getMessages = async (req, res) => {
  try {
    const { matchId } = req.params
    const userId = req.user._id

    // Verify user is part of the match
    const match = await Match.findById(matchId)
    if (!match || !match.users.some(user => user.equals(userId))) {
      return res.status(403).json({ message: 'Not authorized for this match' })
    }

    const messages = await Message.find({ match: matchId })
      .populate('sender', 'name')
      .sort({ createdAt: 1 })

    res.json(messages)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}