import { Request, Response, NextFunction } from 'express';
import winstonEnvLogger from 'winston-env-logger';
import axios from 'axios';

import { Account } from '../../db';

import { respondWithWarning } from '../../lib/httpResponse';

export default async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  try {
    const {data}: any  = await axios.get(`https://block-temporary-email.com/check/email/${email}`);
    if (data){
      const {status, temporary} = await data;
      if (status === 200 && temporary === true){
        return respondWithWarning(res, 400, 'Please do not use disposable email address');
      }
    }
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
