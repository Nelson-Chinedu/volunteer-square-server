import { Request, Response, NextFunction } from 'express';

import { verifyEmailToken } from '../../lib/token';
import { respondWithWarning } from '../../lib/httpResponse';

export default (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.body;

  try {
    const isValid = verifyEmailToken(token as string);
    if (isValid) {
      return next();
    }
  } catch (error) {
    return respondWithWarning(res, 400, 'Not authorized');
  }
};
