import { Request, Response, NextFunction } from 'express';
import winstonEnvLogger from 'winston-env-logger';

import { Account } from '../../db';

import { respondWithWarning } from '../../lib/httpResponse';

export default async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  try {
    const checkEmail = await Account.findOne({
      where: {
        email,
      },
    });
    if (checkEmail) {
      return respondWithWarning(res, 400, 'Email address aready in use');
    }
    return next();
  } catch (error) {
    winstonEnvLogger.error({
      message: 'An error occured',
      error,
    });
  }
};
