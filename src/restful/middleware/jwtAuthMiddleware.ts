import { Request, Response, NextFunction } from 'express';

import { verifyToken } from '../../lib/token';
import authenticateUser from '../../lib/authenticateRequest';

export default async (req: Request, _res: Response, next: NextFunction) => {
  const bearerToken: string | undefined  = req.headers.authorization;
  if (!bearerToken) {
    return next();
  }

  const accessToken = bearerToken.split(' ')[1];
  try {
    const decodeData = verifyToken(accessToken);
    authenticateUser(decodeData, req);
  } catch (error) {
    //
  }
  return next();
};
