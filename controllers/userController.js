const User = require('../models/User')
const UserProfile = require('../models/UserProfile')

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update user
exports.updateUser = async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'profileImage']
  const isValidOperation = updates.every(update => allowedUpdates.includes(update))

  if (!isValidOperation) {
    return res.status(400).json({ message: 'Invalid updates' })
  }

  try {
    updates.forEach(update => req.user[update] = req.body[update])
    await req.user.save()
    res.json(req.user)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Delete user (deactivate)
exports.deleteUser = async (req, res) => {
  try {
    req.user.isActive = false
    await req.user.save()
    res.json({ message: 'User deactivated' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get user profile with profile data
exports.getFullProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    const profile = await UserProfile.findOne({ user: req.user._id })
    res.json({ user, profile })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Upload profile image
exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const imageUrl = `/uploads/${req.file.filename}`
    await User.findByIdAndUpdate(req.user._id, { profileImage: imageUrl })

    res.json({ message: 'Profile image updated', imageUrl })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}