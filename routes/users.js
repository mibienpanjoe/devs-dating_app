const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const auth = require('../middleware/auth')

router.get('/profile', auth, userController.getProfile)
router.patch('/profile', auth, userController.updateUser)
router.delete('/profile', auth, userController.deleteUser)
router.get('/full-profile', auth, userController.getFullProfile)

module.exports = router