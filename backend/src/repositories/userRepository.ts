import User, { IUser } from '../models/User';

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
}

export const findByEmail = async (email: string): Promise<IUser | null> => {
  return User.findOne({ email: email.toLowerCase() });
};

export const findById = async (id: string): Promise<IUser | null> => {
  return User.findById(id);
};

export const create = async (data: CreateUserData): Promise<IUser> => {
  const user = new User({
    email: data.email.toLowerCase(),
    password: data.password,
    name: data.name
  });
  return user.save();
};

