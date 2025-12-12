import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';

export const createSweet = async (req: AuthRequest, res: Response): Promise<void> => {
  res.status(201).json({ message: 'Sweet created' });
};

export const getAllSweets = async (req: AuthRequest, res: Response): Promise<void> => {
  res.status(200).json([]);
};

export const getSweetById = async (req: AuthRequest, res: Response): Promise<void> => {
  res.status(200).json({});
};

export const updateSweet = async (req: AuthRequest, res: Response): Promise<void> => {
  res.status(200).json({});
};

export const deleteSweet = async (req: AuthRequest, res: Response): Promise<void> => {
  res.status(200).json({ message: 'Sweet deleted' });
};

