const Swipe = require('../models/Swipe')
const Match = require('../models/Match')
const UserProfile = require('../models/UserProfile')

// Swipe on a user
exports.swipe = async (req, res) => {
  try {
    const { swipedId, action } = req.body
    const swiperId = req.user._id

    if (!['like', 'pass'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action' })
    }

    // Create swipe
    const swipe = new Swipe({
      swiper: swiperId,
      swiped: swipedId,
      action
    })

    await swipe.save()

    let match = null

    if (action === 'like') {
      // Check if mutual like
      const mutualSwipe = await Swipe.findOne({
        swiper: swipedId,
        swiped: swiperId,
        action: 'like'
      })

      if (mutualSwipe) {
        // Create match
        match = new Match({
          users: [swiperId, swipedId]
        })
        await match.save()
      }
    }

    res.json({ swipe, match })
  } catch (error) {
    if (error.code === 11000) { // Duplicate swipe
      return res.status(400).json({ message: 'Already swiped on this user' })
    }
    res.status(500).json({ message: error.message })
  }
}

// Get potential matches (users to swipe on)
exports.getPotentialMatches = async (req, res) => {
  try {
    const userId = req.user._id

    // Find users not swiped on yet
    const swipedIds = await Swipe.find({ swiper: userId }).distinct('swiped')

    const potentialUsers = await UserProfile.find({
      user: { $nin: [...swipedIds, userId] }
    }).populate('user', 'name email profileImage')

    res.json(potentialUsers)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}