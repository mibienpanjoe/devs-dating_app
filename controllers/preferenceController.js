const UserPreferences = require('../models/UserPreferences')

// Create or update preferences
exports.upsertPreferences = async (req, res) => {
  try {
    const preferences = await UserPreferences.findOneAndUpdate(
      { user: req.user._id },
      { ...req.body, user: req.user._id },
      { new: true, upsert: true }
    )
    res.json(preferences)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Get preferences
exports.getPreferences = async (req, res) => {
  try {
    const preferences = await UserPreferences.findOne({ user: req.user._id })
    if (!preferences) {
      return res.status(404).json({ message: 'Preferences not found' })
    }
    res.json(preferences)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update preferences
exports.updatePreferences = async (req, res) => {
  try {
    const preferences = await UserPreferences.findOneAndUpdate(
      { user: req.user._id },
      req.body,
      { new: true }
    )
    if (!preferences) {
      return res.status(404).json({ message: 'Preferences not found' })
    }
    res.json(preferences)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Delete preferences
exports.deletePreferences = async (req, res) => {
  try {
    await UserPreferences.findOneAndDelete({ user: req.user._id })
    res.json({ message: 'Preferences deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}