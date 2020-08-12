import { Request, Response, NextFunction } from 'express';

import { verifyToken } from '../lib/checkToken';

export default async (req: Request, _res: Response, next: NextFunction) => {
  const bearerToken: any = req.headers.authorization;

  if (!bearerToken) {
    return next();
  }

  const accessToken = bearerToken.split(' ')[1];
  try {
    const decodeData = verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET!);
    req.user = decodeData;
  } catch (error) {
    if (error.message === 'jwt expired') {
      req.user = { accessToken };
    }
  }
  return next();
};
