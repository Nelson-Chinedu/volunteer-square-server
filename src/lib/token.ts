import jwt from 'jsonwebtoken';

import IPayload from '../interfaces/IPayload';

export const createToken = (payload: IPayload , secret: string, expiresIn: string): string => {
  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyEmailToken = (token:string): string | object => {
  return jwt.verify(token, process.env.VERIFICATION_JWT_kEY as string);
};

export const verifyToken = (token: any): string | object => {
  return jwt.verify(token, process.env.JWT_KEY as string);
};
