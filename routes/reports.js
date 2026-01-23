const express = require('express')
const router = express.Router()
const reportController = require('../controllers/report')
const auth = require('../middleware/auth')

/**
 * @swagger
 * /reports:
 *   post:
 *     summary: Report a user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reportedId:
 *                 type: string
 *                 description: ID of user being reported
 *               reason:
 *                 type: string
 *                 description: Reason for report
 *     responses:
 *       201:
 *         description: Report submitted
 */
router.post('/', auth, reportController.createReport)

/**
 * @swagger
 * /reports:
 *   get:
 *     summary: Get all reports (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of reports
 *       403:
 *         description: Admin access required
 */
router.get('/', auth, reportController.getReports)

/**
 * @swagger
 * /reports/{id}:
 *   patch:
 *     summary: Update report status (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Report ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, reviewed, resolved]
 *     responses:
 *       200:
 *         description: Report updated
 *       403:
 *         description: Admin access required
 */
router.patch('/:id', auth, reportController.updateReportStatus)

module.exports = router