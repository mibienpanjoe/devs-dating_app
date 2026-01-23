const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const userController = require('../controllers/userController')
const auth = require('../middleware/auth')

// Multer config for profile images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'), false)
    }
  }
})

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 name:
 *                   type: string
 *                 profileImage:
 *                   type: string
 */
router.get('/profile', auth, userController.getProfile)

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
router.patch('/profile', auth, userController.updateUser)

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
router.delete('/profile', auth, userController.deleteUser)

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
router.get('/full-profile', auth, userController.getFullProfile)

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 imageUrl:
 *                   type: string
 */
router.post('/upload-profile-image', auth, upload.single('profileImage'), userController.uploadProfileImage)

module.exports = router