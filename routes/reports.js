const express = require('express')
const router = express.Router()
const reportController = require('../controllers/report')
const auth = require('../middleware/auth')

router.post('/', auth, reportController.createReport)
router.get('/', auth, reportController.getReports)
router.patch('/:id', auth, reportController.updateReportStatus)

module.exports = router