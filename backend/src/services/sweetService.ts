import * as sweetRepository from '../repositories/sweetRepository';
import { ISweet } from '../models/Sweet';

export interface CreateSweetData {
  name: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
  imageUrl?: string;
}

export interface UpdateSweetData {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  quantity?: number;
  imageUrl?: string;
}

export interface SearchParams {
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export const createSweet = async (data: CreateSweetData): Promise<ISweet> => {
  return sweetRepository.create(data);
};

export const getAllSweets = async (): Promise<ISweet[]> => {
  return sweetRepository.findAll();
};

export const getSweetById = async (id: string): Promise<ISweet> => {
  const sweet = await sweetRepository.findById(id);
  if (!sweet) {
    const error = new Error('Sweet not found') as Error & { statusCode: number };
    error.statusCode = 404;
    throw error;
  }
  return sweet;
};

export const updateSweet = async (id: string, data: UpdateSweetData): Promise<ISweet> => {
  const sweet = await sweetRepository.update(id, data);
  if (!sweet) {
    const error = new Error('Sweet not found') as Error & { statusCode: number };
    error.statusCode = 404;
    throw error;
  }
  return sweet;
};

export const deleteSweet = async (id: string): Promise<void> => {
  const sweet = await sweetRepository.remove(id);
  if (!sweet) {
    const error = new Error('Sweet not found') as Error & { statusCode: number };
    error.statusCode = 404;
    throw error;
  }
};

export const searchSweets = async (params: SearchParams): Promise<ISweet[]> => {
  return sweetRepository.search(params);
};

