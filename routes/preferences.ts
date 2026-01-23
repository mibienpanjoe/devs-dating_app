import express from 'express';
import preferenceController from '../controllers/preferenceController';
import auth from '../middleware/auth';

const router = express.Router();

/**
 * @swagger
 * /preferences:
 *   post:
 *     summary: Create or update user preferences
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               preferredLanguages:
 *                 type: array
 *                 items:
 *                   type: string
 *               preferredSkills:
 *                 type: array
 *                 items:
 *                   type: string
 *               maxDistance:
 *                 type: integer
 *               minAge:
 *                 type: integer
 *               maxAge:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Preferences created/updated
 */
router.post('/', auth, preferenceController.upsertPreferences);

/**
 * @swagger
 * /preferences:
 *   get:
 *     summary: Get user preferences
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User preferences
 */
router.get('/', auth, preferenceController.getPreferences);

/**
 * @swagger
 * /preferences:
 *   patch:
 *     summary: Update user preferences
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               preferredLanguages:
 *                 type: array
 *                 items:
 *                   type: string
 *               preferredSkills:
 *                 type: array
 *                 items:
 *                   type: string
 *               maxDistance:
 *                 type: integer
 *               minAge:
 *                 type: integer
 *               maxAge:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Preferences updated
 */
router.patch('/', auth, preferenceController.updatePreferences);

/**
 * @swagger
 * /preferences:
 *   delete:
 *     summary: Delete user preferences
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Preferences deleted
 */
router.delete('/', auth, preferenceController.deletePreferences);

export default router;