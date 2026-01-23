const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require("../models/User.js")

// Register a user
exports.register = async (req, res) => {
    try {
        const { email, password, name } = req.body

        const existing = await User.findOne({ email })
        if (existing) {
            return res.status(400).json({
                message: "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new User({ email, password: hashedPassword, name })

        await user.save()

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.status(201).json({
            user,
            token
        })
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}

// Login a user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials"
            })
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.json({
            user,
            token
        })
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}

// Logout (client-side, but endpoint for consistency)
exports.logout = (req, res) => {
    res.json({ message: 'Logged out' })
} 

