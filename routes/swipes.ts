import express from 'express';
import swipeController from '../controllers/swipeController';
import auth from '../middleware/auth';

const router = express.Router();

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
router.post('/', auth, swipeController.swipe);

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
 */
router.get('/potential', auth, swipeController.getPotentialMatches);

export default router;