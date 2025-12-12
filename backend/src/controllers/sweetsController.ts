import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as sweetService from '../services/sweetService';

export const createSweet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, price, category, quantity, imageUrl } = req.body;
    const sweet = await sweetService.createSweet({
      name,
      description,
      price,
      category,
      quantity,
      imageUrl
    });
    res.status(201).json({ sweet });
  } catch (error) {
    const err = error as Error & { statusCode?: number };
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ message: err.message });
  }
};

export const getAllSweets = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sweets = await sweetService.getAllSweets();
    res.status(200).json({ sweets });
  } catch (error) {
    const err = error as Error & { statusCode?: number };
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ message: err.message });
  }
};

export const getSweetById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const sweet = await sweetService.getSweetById(id);
    res.status(200).json({ sweet });
  } catch (error) {
    const err = error as Error & { statusCode?: number };
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ message: err.message });
  }
};

export const updateSweet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, price, category, quantity, imageUrl } = req.body;
    const sweet = await sweetService.updateSweet(id, {
      name,
      description,
      price,
      category,
      quantity,
      imageUrl
    });
    res.status(200).json({ sweet });
  } catch (error) {
    const err = error as Error & { statusCode?: number };
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ message: err.message });
  }
};

export const deleteSweet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await sweetService.deleteSweet(id);
    res.status(200).json({ message: 'Sweet deleted successfully' });
  } catch (error) {
    const err = error as Error & { statusCode?: number };
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ message: err.message });
  }
};

export const searchSweets = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    const sweets = await sweetService.searchSweets({
      name: name as string,
      category: category as string,
      minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined
    });
    res.status(200).json({ sweets });
  } catch (error) {
    const err = error as Error & { statusCode?: number };
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ message: err.message });
  }
};

export const purchaseSweet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const quantity = req.body?.quantity ?? 1;
    const sweet = await sweetService.purchaseSweet(id, quantity);
    res.status(200).json({ sweet });
  } catch (error) {
    const err = error as Error & { statusCode?: number };
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ message: err.message });
  }
};

export const restockSweet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    if (!quantity || quantity <= 0) {
      res.status(400).json({ message: 'Quantity must be a positive number' });
      return;
    }
    const sweet = await sweetService.restockSweet(id, quantity);
    res.status(200).json({ sweet });
  } catch (error) {
    const err = error as Error & { statusCode?: number };
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ message: err.message });
  }
};
