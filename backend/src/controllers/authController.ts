import { Request, Response } from 'express';
import { registerUser } from '../services/authService';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;
    const result = await registerUser({ email, password, name });
    res.status(201).json(result);
  } catch (error) {
    const err = error as Error & { statusCode?: number };
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ message: 'Login successful' });
};
