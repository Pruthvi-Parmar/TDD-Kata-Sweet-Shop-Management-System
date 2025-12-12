import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import User, { IUser } from '../models/User';

export interface RegisterData {
  email: string;
  password: string;
  name: string;
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
  const existingUser = await User.findOne({ email: data.email.toLowerCase() });
  if (existingUser) {
    const error = new Error('Email already exists') as Error & { statusCode: number };
    error.statusCode = 409;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.password, salt);

  const user = new User({
    email: data.email.toLowerCase(),
    password: hashedPassword,
    name: data.name
  });

  await user.save();

  const token = generateToken(user);

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

export const generateToken = (user: IUser): string => {
  const secret = process.env.JWT_SECRET || 'default-secret';
  const options: SignOptions = {
    expiresIn: '7d'
  };
  return jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    secret,
    options
  );
};
