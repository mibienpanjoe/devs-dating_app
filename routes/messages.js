const express = require('express')
const router = express.Router()
const messageController = require('../controllers/messageController')
const auth = require('../middleware/auth')

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 match:
 *                   type: string
 *                 sender:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                 content:
 *                   type: string
 *                 read:
 *                   type: boolean
 *                 delivered:
 *                   type: boolean
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 */
router.post('/', auth, messageController.sendMessage)

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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   match:
 *                     type: string
 *                   sender:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                   content:
 *                     type: string
 *                   read:
 *                     type: boolean
 *                   delivered:
 *                     type: boolean
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 */
router.get('/:matchId', auth, messageController.getMessages)

module.exports = router