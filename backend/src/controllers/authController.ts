import { Request, Response } from 'express';

export const register = async (req: Request, res: Response): Promise<void> => {
  res.status(201).json({ message: 'User registered successfully' });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ message: 'Login successful' });
};

