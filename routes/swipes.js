const express = require('express')
const router = express.Router()
const swipeController = require('../controllers/swipeController')
const auth = require('../middleware/auth')

router.post('/', auth, swipeController.swipe)
router.get('/potential', auth, swipeController.getPotentialMatches)

module.exports = router