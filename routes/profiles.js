const express = require('express')
const router = express.Router()
const profileController = require('../controllers/profileController')
const auth = require('../middleware/auth')

/**
 * @swagger
 * /profiles:
 *   post:
 *     summary: Create or update user profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bio:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               languages:
 *                 type: array
 *                 items:
 *                   type: string
 *               github:
 *                 type: string
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *               location:
 *                 type: string
 *               age:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Profile created/updated
 */
router.post('/', auth, profileController.upsertProfile)

/**
 * @swagger
 * /profiles:
 *   get:
 *     summary: Get user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 */
router.get('/', auth, profileController.getProfile)

/**
 * @swagger
 * /profiles:
 *   patch:
 *     summary: Update user profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bio:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               languages:
 *                 type: array
 *                 items:
 *                   type: string
 *               github:
 *                 type: string
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *               location:
 *                 type: string
 *               age:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.patch('/', auth, profileController.updateProfile)

/**
 * @swagger
 * /profiles:
 *   delete:
 *     summary: Delete user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile deleted
 */
router.delete('/', auth, profileController.deleteProfile)
/**
 * @swagger
 * /profiles/compatibility/{userId}:
 *   get:
 *     summary: Get compatibility score with another user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the other user
 *     responses:
 *       200:
 *         description: Compatibility score
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 compatibilityScore:
 *                   type: number
 *                   description: Score between 0 and 1
 */
router.get('/compatibility/:userId', auth, profileController.getCompatibility)

module.exports = router