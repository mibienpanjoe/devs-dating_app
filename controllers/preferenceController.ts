import { Response } from 'express';
import UserPreferences from '../models/UserPreferences';
import cache from '../utils/cache';

export const upsertPreferences = async (req: any, res: Response): Promise<void> => {
  try {
    const preferences = await UserPreferences.findOneAndUpdate(
      { user: req.user._id },
      { ...req.body, user: req.user._id },
      { new: true, upsert: true }
    );
    res.json(preferences);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getPreferences = async (req: any, res: Response): Promise<void> => {
  try {
    const preferences = await UserPreferences.findOne({ user: req.user._id });
    if (!preferences) {
      res.status(404).json({ message: 'Preferences not found' });
      return;
    }
    res.json(preferences);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updatePreferences = async (req: any, res: Response): Promise<void> => {
  try {
    const preferences = await UserPreferences.findOneAndUpdate(
      { user: req.user._id },
      req.body,
      { new: true }
    );
    if (!preferences) {
      res.status(404).json({ message: 'Preferences not found' });
      return;
    }
    res.json(preferences);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const deletePreferences = async (req: any, res: Response): Promise<void> => {
  try {
    await UserPreferences.findOneAndDelete({ user: req.user._id });
    res.json({ message: 'Preferences deleted' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export default {
  upsertPreferences,
  getPreferences,
  updatePreferences,
  deletePreferences
};