const express = require('express')
const router = express.Router()
const matchController = require('../controllers/matchController')
const auth = require('../middleware/auth')

/**
 * @swagger
 * /matches:
 *   get:
 *     summary: Get user's matches
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's matches
 */
router.get('/', auth, matchController.getMatches)

/**
 * @swagger
 * /matches/{id}:
 *   get:
 *     summary: Get specific match details
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Match ID
 *     responses:
 *       200:
 *         description: Match details
 */
router.get('/:id', auth, matchController.getMatch)

module.exports = router