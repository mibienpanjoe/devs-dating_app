import { Response } from 'express';
import UserProfile from '../models/UserProfile';
import UserPreferences from '../models/UserPreferences';
import { geocodeAddress } from '../utils/geocode';
import { calculateCompatibility } from '../utils/matching';
import cache from '../utils/cache';

export const upsertProfile = async (req: any, res: Response): Promise<void> => {
  try {
    const updateData: any = { ...req.body, user: req.user._id };

    // Geocode location if provided
    if (req.body.location && req.body.location.trim()) {
      const coordinates = await geocodeAddress(req.body.location);
      if (coordinates) {
        updateData.coordinates = coordinates;
      }
    }

    const profile = await UserProfile.findOneAndUpdate(
      { user: req.user._id },
      updateData,
      { new: true, upsert: true }
    );

    // Clear related caches
    await cache.del(`potential_matches:${req.user._id}`);
    await cache.clearPattern(`compatibility:${req.user._id}:*`);
    await cache.clearPattern(`compatibility:*:${req.user._id}`);

    res.json(profile);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getProfile = async (req: any, res: Response): Promise<void> => {
  try {
    const profile = await UserProfile.findOne({ user: req.user._id });
    if (!profile) {
      res.status(404).json({ message: 'Profile not found' });
      return;
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateProfile = async (req: any, res: Response): Promise<void> => {
  try {
    const updateData: any = req.body;

    // Geocode location if provided
    if (req.body.location && req.body.location.trim()) {
      const coordinates = await geocodeAddress(req.body.location);
      if (coordinates) {
        updateData.coordinates = coordinates;
      }
    }

    const profile = await UserProfile.findOneAndUpdate(
      { user: req.user._id },
      updateData,
      { new: true }
    );
    if (!profile) {
      res.status(404).json({ message: 'Profile not found' });
      return;
    }

    // Clear related caches
    await cache.del(`potential_matches:${req.user._id}`);
    await cache.clearPattern(`compatibility:${req.user._id}:*`);
    await cache.clearPattern(`compatibility:*:${req.user._id}`);

    res.json(profile);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const deleteProfile = async (req: any, res: Response): Promise<void> => {
  try {
    await UserProfile.findOneAndDelete({ user: req.user._id });
    res.json({ message: 'Profile deleted' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getCompatibility = async (req: any, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const cacheKey = `compatibility:${req.user._id}:${userId}`;

    // Check cache
    const cached = await cache.get(cacheKey);
    if (cached !== null) {
      res.json({ compatibilityScore: cached });
      return;
    }

    const [userProfile1, userProfile2, preferences1] = await Promise.all([
      UserProfile.findOne({ user: req.user._id }),
      UserProfile.findOne({ user: userId }),
      UserPreferences.findOne({ user: req.user._id })
    ]);

    if (!userProfile1 || !userProfile2) {
      res.status(404).json({ message: 'Profile not found' });
      return;
    }

    const score = calculateCompatibility(userProfile1, userProfile2, preferences1, null);

    // Cache for 1 hour
    await cache.set(cacheKey, score, 3600);

    res.json({ compatibilityScore: score });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export default {
  upsertProfile,
  getProfile,
  updateProfile,
  deleteProfile,
  getCompatibility
};