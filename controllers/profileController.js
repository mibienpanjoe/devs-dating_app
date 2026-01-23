const UserProfile = require('../models/UserProfile')
const UserPreferences = require('../models/UserPreferences')
const { geocodeAddress } = require('../utils/geocode')
const { calculateCompatibility } = require('../utils/matching')

// Create or update profile
exports.upsertProfile = async (req, res) => {
  try {
    const updateData = { ...req.body, user: req.user._id }

    // Geocode location if provided
    if (req.body.location && req.body.location.trim()) {
      const coordinates = await geocodeAddress(req.body.location)
      if (coordinates) {
        updateData.coordinates = coordinates
      }
    }

    const profile = await UserProfile.findOneAndUpdate(
      { user: req.user._id },
      updateData,
      { new: true, upsert: true }
    )
    res.json(profile)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Get profile
exports.getProfile = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ user: req.user._id })
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' })
    }
    res.json(profile)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const updateData = req.body

    // Geocode location if provided
    if (req.body.location && req.body.location.trim()) {
      const coordinates = await geocodeAddress(req.body.location)
      if (coordinates) {
        updateData.coordinates = coordinates
      }
    }

    const profile = await UserProfile.findOneAndUpdate(
      { user: req.user._id },
      updateData,
      { new: true }
    )
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' })
    }
    res.json(profile)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Delete profile
exports.deleteProfile = async (req, res) => {
  try {
    await UserProfile.findOneAndDelete({ user: req.user._id })
    res.json({ message: 'Profile deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get compatibility score with another user
exports.getCompatibility = async (req, res) => {
  try {
    const { userId } = req.params

    const [userProfile1, userProfile2, preferences1] = await Promise.all([
      UserProfile.findOne({ user: req.user._id }),
      UserProfile.findOne({ user: userId }),
      UserPreferences.findOne({ user: req.user._id })
    ])

    if (!userProfile1 || !userProfile2) {
      return res.status(404).json({ message: 'Profile not found' })
    }

    const score = calculateCompatibility(userProfile1, userProfile2, preferences1, null)

    res.json({ compatibilityScore: score })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}