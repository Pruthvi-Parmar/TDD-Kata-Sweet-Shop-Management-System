import bcrypt from 'bcryptjs';
import * as userRepository from '../repositories/userRepository';
import { generateToken } from '../utils/jwt';

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResult {
  user: {
    _id: string;
    email: string;
    name: string;
    role: string;
  };
  token: string;
}

export const registerUser = async (data: RegisterData): Promise<AuthResult> => {
  const existingUser = await userRepository.findByEmail(data.email);
  if (existingUser) {
    const error = new Error('Email already exists') as Error & { statusCode: number };
    error.statusCode = 409;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.password, salt);

  const user = await userRepository.create({
    email: data.email,
    password: hashedPassword,
    name: data.name
  });

  const token = generateToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role
  });

  return {
    user: {
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role
    },
    token
  };
};

export const loginUser = async (data: LoginData): Promise<AuthResult> => {
  const user = await userRepository.findByEmail(data.email);
  if (!user) {
    const error = new Error('Invalid credentials') as Error & { statusCode: number };
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);
  if (!isPasswordValid) {
    const error = new Error('Invalid credentials') as Error & { statusCode: number };
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role
  });

  return {
    user: {
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role
    },
    token
  };
};
