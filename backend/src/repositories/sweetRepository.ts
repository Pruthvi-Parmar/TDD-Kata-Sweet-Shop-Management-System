import Sweet, { ISweet } from '../models/Sweet';

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

export const create = async (data: CreateSweetData): Promise<ISweet> => {
  const sweet = new Sweet(data);
  return sweet.save();
};

export const findAll = async (): Promise<ISweet[]> => {
  return Sweet.find().sort({ createdAt: -1 });
};

export const findById = async (id: string): Promise<ISweet | null> => {
  return Sweet.findById(id);
};

export const update = async (id: string, data: UpdateSweetData): Promise<ISweet | null> => {
  return Sweet.findByIdAndUpdate(id, data, { new: true });
};

export const remove = async (id: string): Promise<ISweet | null> => {
  return Sweet.findByIdAndDelete(id);
};

export const search = async (params: SearchParams): Promise<ISweet[]> => {
  const query: Record<string, unknown> = {};

  if (params.name) {
    query.name = { $regex: params.name, $options: 'i' };
  }

  if (params.category) {
    query.category = { $regex: params.category, $options: 'i' };
  }

  if (params.minPrice !== undefined || params.maxPrice !== undefined) {
    query.price = {};
    if (params.minPrice !== undefined) {
      (query.price as Record<string, number>).$gte = params.minPrice;
    }
    if (params.maxPrice !== undefined) {
      (query.price as Record<string, number>).$lte = params.maxPrice;
    }
  }

  return Sweet.find(query).sort({ createdAt: -1 });
};

