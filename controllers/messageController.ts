import { Response } from 'express';
import Message from '../models/Message';
import Match from '../models/Match';

export const sendMessage = async (req: any, res: Response): Promise<void> => {
  try {
    const { matchId, content } = req.body;
    const senderId = req.user._id;

    // Verify user is part of the match
    const match = await Match.findById(matchId);
    if (!match || !match.users.some((user: any) => user.equals(senderId))) {
      res.status(403).json({ message: 'Not authorized for this match' });
      return;
    }

    const message = new Message({
      match: matchId,
      sender: senderId,
      content,
      delivered: true
    });

    await message.save();
    await message.populate('sender', 'name');

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getMessages = async (req: any, res: Response): Promise<void> => {
  try {
    const { matchId } = req.params;
    const userId = req.user._id;

    // Verify user is part of the match
    const match = await Match.findById(matchId);
    if (!match || !match.users.some((user: any) => user.equals(userId))) {
      res.status(403).json({ message: 'Not authorized for this match' });
      return;
    }

    const messages = await Message.find({ match: matchId })
      .populate('sender', 'name')
      .sort({ createdAt: 1 });

    // Mark messages as read if not from sender
    await Message.updateMany(
      { match: matchId, sender: { $ne: userId }, read: false },
      { read: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export default {
  sendMessage,
  getMessages
};