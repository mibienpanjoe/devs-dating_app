import { Response } from 'express';
import Swipe from '../models/Swipe';
import Match from '../models/Match';
import UserProfile from '../models/UserProfile';
import UserPreferences from '../models/UserPreferences';
import { calculateDistance } from '../utils/geocode';
import { calculateCompatibility } from '../utils/matching';
import cache from '../utils/cache';

export const swipe = async (req: any, res: Response): Promise<void> => {
  try {
    const { swipedId, action } = req.body;
    const swiperId = req.user._id;

    if (!['like', 'pass'].includes(action)) {
      res.status(400).json({ message: 'Invalid action' });
      return;
    }

    // Create swipe
    const swipe = new Swipe({
      swiper: swiperId,
      swiped: swipedId,
      action
    });

    await swipe.save();

    let match = null;

    if (action === 'like') {
      // Check if mutual like
      const mutualSwipe = await Swipe.findOne({
        swiper: swipedId,
        swiped: swiperId,
        action: 'like'
      });

      if (mutualSwipe) {
        // Create match
        match = new Match({
          users: [swiperId, swipedId]
        });
        await match.save();
      }
    }

    // Clear potential matches cache for swiper
    await cache.del(`potential_matches:${swiperId}`);

    res.json({ swipe, match });
  } catch (error) {
    if ((error as any).code === 11000) { // Duplicate swipe
      res.status(400).json({ message: 'Already swiped on this user' });
      return;
    }
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getPotentialMatches = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;
    const cacheKey = `potential_matches:${userId}`;

    // Check cache first
    const cached = await cache.get(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }

    // Get user's preferences and profile
    const [preferences, userProfile] = await Promise.all([
      UserPreferences.findOne({ user: userId }),
      UserProfile.findOne({ user: userId })
    ]);

    // Find users not swiped on yet
    const swipedIds = await Swipe.find({ swiper: userId }).distinct('swiped');

    let potentialUsers = await UserProfile.find({
      user: { $nin: [...swipedIds, userId] },
      coordinates: { $exists: true } // Only users with coordinates
    }).populate('user', 'name email profileImage');

    // Filter by age preferences
    if (preferences && (preferences.minAge || preferences.maxAge)) {
      potentialUsers = potentialUsers.filter(profile => {
        if (!profile.age) return true; // Include if no age set
        if (preferences.minAge && profile.age < preferences.minAge) return false;
        if (preferences.maxAge && profile.age > preferences.maxAge) return false;
        return true;
      });
    }

    // Calculate compatibility scores and sort
    const scoredUsers = potentialUsers.map(profile => {
      const score = calculateCompatibility(userProfile!, profile, preferences, null);
      return { profile, score };
    }).sort((a, b) => b.score - a.score);

    const result = scoredUsers.map(item => ({ ...item.profile.toObject(), compatibilityScore: item.score }));

    // Cache for 10 minutes
    await cache.set(cacheKey, result, 600);

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export default {
  swipe,
  getPotentialMatches
};