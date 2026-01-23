const express = require('express')
const router = express.Router()
const preferenceController = require('../controllers/preferenceController')
const auth = require('../middleware/auth')

router.post('/', auth, preferenceController.upsertPreferences)
router.get('/', auth, preferenceController.getPreferences)
router.patch('/', auth, preferenceController.updatePreferences)
router.delete('/', auth, preferenceController.deletePreferences)

module.exports = router