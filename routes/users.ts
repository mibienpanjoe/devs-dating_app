import express from 'express';
import userController, { upload } from '../controllers/userController';
import auth from '../middleware/auth';

const router = express.Router();

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get current user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 */
router.get('/profile', auth, userController.getProfile);

/**
 * @swagger
 * /users/profile:
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
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               profileImage:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated user profile
 */
router.patch('/profile', auth, userController.updateUser);

/**
 * @swagger
 * /users/profile:
 *   delete:
 *     summary: Delete (deactivate) user account
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deactivated
 */
router.delete('/profile', auth, userController.deleteUser);

/**
 * @swagger
 * /users/full-profile:
 *   get:
 *     summary: Get full user profile with profile data
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Full profile including user and profile details
 */
router.get('/full-profile', auth, userController.getFullProfile);

/**
 * @swagger
 * /users/upload-profile-image:
 *   post:
 *     summary: Upload profile image
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: Image file (max 5MB, image types only)
 *     responses:
 *       200:
 *         description: Profile image updated
 */
router.post('/upload-profile-image', auth, upload.single('profileImage'), userController.uploadProfileImage);

export default router;