import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_SECRET || 'default-secret';
  const options: SignOptions = {
    expiresIn: '7d'
  };
  return jwt.sign(payload, secret, options);
};

export const verifyToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_SECRET || 'default-secret';
  const decoded = jwt.verify(token, secret) as JwtPayload & TokenPayload;
  return {
    userId: decoded.userId,
    email: decoded.email,
    role: decoded.role
  };
};

