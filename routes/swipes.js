const express = require('express')
const router = express.Router()
const swipeController = require('../controllers/swipeController')
const auth = require('../middleware/auth')

/**
 * @swagger
 * /swipes:
 *   post:
 *     summary: Swipe on a user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               swipedId:
 *                 type: string
 *                 description: ID of the user being swiped
 *               action:
 *                 type: string
 *                 enum: [like, pass]
 *     responses:
 *       200:
 *         description: Swipe recorded, match if mutual
 */
router.post('/', auth, swipeController.swipe)

/**
 * @swagger
 * /swipes/potential:
 *   get:
 *     summary: Get potential matches to swipe on (sorted by compatibility score)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of potential users with compatibility scores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   user:
 *                     type: object
 *                   bio:
 *                     type: string
 *                   skills:
 *                     type: array
 *                     items:
 *                       type: string
 *                   languages:
 *                     type: array
 *                     items:
 *                       type: string
 *                   compatibilityScore:
 *                     type: number
 *                     description: Compatibility score (0-1)
 */
router.get('/potential', auth, swipeController.getPotentialMatches)

module.exports = router