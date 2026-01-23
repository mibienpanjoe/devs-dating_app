import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import User from '../models/User';
import { RegisterRequest, LoginRequest, AuthResponse } from '../types';

export const register = async (req: Request<{}, {}, RegisterRequest>, res: Response<AuthResponse | { message: string }>): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, name });

    await user.save();

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const login = async (req: Request<{}, {}, LoginRequest>, res: Response<AuthResponse | { message: string }>): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const logout = (req: Request, res: Response<{ message: string }>): void => {
  res.json({ message: 'Logged out' });
};

export default { register, login, logout };