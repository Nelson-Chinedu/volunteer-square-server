import jwt from 'jsonwebtoken';

export const verifyToken = (token: string, secret: any) => {
  return jwt.verify(token, secret);
};

export const decodeToken = (token: string) => {
  return jwt.decode(token);
};
