const Match = require('../models/Match')

// Get user's matches
exports.getMatches = async (req, res) => {
  try {
    const matches = await Match.find({
      users: req.user._id
    }).populate('users', 'name email profileImage')
    res.json(matches)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get specific match
exports.getMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id).populate('users', 'name email profileImage')
    if (!match || !match.users.some(user => user._id.equals(req.user._id))) {
      return res.status(404).json({ message: 'Match not found' })
    }
    res.json(match)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}