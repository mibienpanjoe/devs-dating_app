const Swipe = require('../models/Swipe')
const Match = require('../models/Match')
const UserProfile = require('../models/UserProfile')
const UserPreferences = require('../models/UserPreferences')
const { calculateDistance } = require('../utils/geocode')

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

    // Get user's preferences and profile
    const [preferences, userProfile] = await Promise.all([
      UserPreferences.findOne({ user: userId }),
      UserProfile.findOne({ user: userId })
    ])

    // Find users not swiped on yet
    const swipedIds = await Swipe.find({ swiper: userId }).distinct('swiped')

    let potentialUsers = await UserProfile.find({
      user: { $nin: [...swipedIds, userId] },
      coordinates: { $exists: true } // Only users with coordinates
    }).populate('user', 'name email profileImage')

    // Filter by distance if user has coordinates and preferences
    if (userProfile && userProfile.coordinates && preferences && preferences.maxDistance) {
      potentialUsers = potentialUsers.filter(profile => {
        if (!profile.coordinates) return false
        const distance = calculateDistance(userProfile.coordinates, profile.coordinates)
        return distance <= preferences.maxDistance
      })
    }

    // Filter by age preferences
    if (preferences && (preferences.minAge || preferences.maxAge)) {
      potentialUsers = potentialUsers.filter(profile => {
        if (!profile.age) return true // Include if no age set
        if (preferences.minAge && profile.age < preferences.minAge) return false
        if (preferences.maxAge && profile.age > preferences.maxAge) return false
        return true
      })
    }

    res.json(potentialUsers)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}