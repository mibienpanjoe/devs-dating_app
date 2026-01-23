import express from 'express';
import messageController from '../controllers/messageController';
import auth from '../middleware/auth';

const router = express.Router();

/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Send a message in a match
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               matchId:
 *                 type: string
 *                 description: Match ID
 *               content:
 *                 type: string
 *                 description: Message content
 *     responses:
 *       201:
 *         description: Message sent
 */
router.post('/', auth, messageController.sendMessage);

/**
 * @swagger
 * /messages/{matchId}:
 *   get:
 *     summary: Get messages for a match (marks unread as read)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: matchId
 *         required: true
 *         schema:
 *           type: string
 *         description: Match ID
 *     responses:
 *       200:
 *         description: List of messages
 */
router.get('/:matchId', auth, messageController.getMessages);

export default router;