import { Response } from 'express';
import Match from '../models/Match';

export const getMatches = async (req: any, res: Response): Promise<void> => {
  try {
    const matches = await Match.find({
      users: req.user._id
    }).populate('users', 'name email profileImage');
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getMatch = async (req: any, res: Response): Promise<void> => {
  try {
    const match = await Match.findById(req.params.id).populate('users', 'name email profileImage');
    if (!match || !match.users.some((user: any) => user._id.equals(req.user._id))) {
      res.status(404).json({ message: 'Match not found' });
      return;
    }
    res.json(match);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export default {
  getMatches,
  getMatch
};