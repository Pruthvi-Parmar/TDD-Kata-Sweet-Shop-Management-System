export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export interface Sweet {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export interface ApiError {
  message: string;
  errors?: { field: string; message: string }[];
}

