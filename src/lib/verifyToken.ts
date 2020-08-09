import jwt from 'jsonwebtoken';

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.SECRET as string);
};

export const decodeToken = (token: string) => {
  return jwt.decode(token);
};
