import { Request, Response, NextFunction } from 'express';

import { verifyToken } from '../lib/verifyToken';

export default async (req: Request, _res: Response, next: NextFunction) => {
  const bearerToken: any = req.headers.authorization;

  if (!bearerToken) {
    return next();
  }
  const accessToken = bearerToken.split(' ')[0];
  try {
    const decodeData = verifyToken(accessToken);
    req.user = decodeData;
  } catch (error) {

    if (error.message === 'jwt expired') {
      req.user = {accessToken};
    }

  }
  return next();
};
