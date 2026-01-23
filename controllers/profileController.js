const UserProfile = require('../models/UserProfile')

// Create or update profile
exports.upsertProfile = async (req, res) => {
  try {
    const profile = await UserProfile.findOneAndUpdate(
      { user: req.user._id },
      { ...req.body, user: req.user._id },
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
    const profile = await UserProfile.findOneAndUpdate(
      { user: req.user._id },
      req.body,
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