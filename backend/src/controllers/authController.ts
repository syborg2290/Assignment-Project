import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import User from '../models/user';
import { JWT_SECRET } from '../config/config';

// Helper function for password hashing
const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

// Input validation function
const validateUserInput = (email: string, password: string, username?: string): boolean => {
  return email.length > 0 && password.length >= 6 && (!username || username.length > 0);
};

// Utility function to sanitize user data
const sanitizeUser = (user: any) => {
  if (user.toObject) {
    user = user.toObject();
  }
  delete user.password; // Remove password
  delete user.__v; // Remove version key

  return user;
};

// Register new user
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;

    if (!validateUserInput(email, password, username)) {
      return res.status(400).send({ error: 'Invalid input' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send({ error: 'User already exists' });
    }

    // const hashedPassword = await hashPassword(password);
    const user = new User({ email, username, password: password });
    await user.save();

    res.status(201).send({ user: sanitizeUser(user) });
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

// User login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '2h' });
    res.send({ user: sanitizeUser(user), token });
  } catch (error) {
    // console.log(error)
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

// Get user profile by ID
export const userProfile = async (req: Request, res: Response) => {
  try {
    // Extract user ID from request parameters
    const userId = req.query.id;

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    // Send sanitized user data
    res.send({ profile: sanitizeUser(user) });
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

