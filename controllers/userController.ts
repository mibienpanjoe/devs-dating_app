import { Response } from 'express';
import User from '../models/User';
import UserProfile from '../models/UserProfile';
import cache from '../utils/cache';
import multer from 'multer';
import path from 'path';

// Configure multer for profile images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed') as any, false);
    }
  }
});

export const getProfile = async (req: any, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateUser = async (req: any, res: Response): Promise<void> => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'profileImage'];
  const isValidOperation = updates.every((update: string) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    res.status(400).json({ message: 'Invalid updates' });
    return;
  }

  try {
    updates.forEach((update: string) => (req.user as any)[update] = req.body[update]);
    await req.user.save();
    res.json(req.user);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const deleteUser = async (req: any, res: Response): Promise<void> => {
  try {
    req.user.isActive = false;
    await req.user.save();
    res.json({ message: 'User deactivated' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getFullProfile = async (req: any, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const profile = await UserProfile.findOne({ user: req.user._id });
    res.json({ user, profile });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const uploadProfileImage = async (req: any, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    await User.findByIdAndUpdate(req.user._id, { profileImage: imageUrl });

    res.json({ message: 'Profile image updated', imageUrl });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export { upload };

export default {
  getProfile,
  updateUser,
  deleteUser,
  getFullProfile,
  uploadProfileImage
};