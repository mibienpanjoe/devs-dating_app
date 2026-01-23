const express = require('express')
const router = express.Router()
const profileController = require('../controllers/profileController')
const auth = require('../middleware/auth')

router.post('/', auth, profileController.upsertProfile)
router.get('/', auth, profileController.getProfile)
router.patch('/', auth, profileController.updateProfile)
router.delete('/', auth, profileController.deleteProfile)

module.exports = router