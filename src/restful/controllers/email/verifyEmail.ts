import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import winstonEnvLogger from 'winston-env-logger';

import { Account } from '../../../db';

import { verifyEmailToken } from '../../../lib/token';
import { respondWithWarning, respondWithSuccess } from '../../../lib/httpResponse';

const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.query;
  try {
    const verifiedToken:any = verifyEmailToken(token as string);
    const { id } = verifiedToken;
    const account = await Account.findOne({
      where: {
        id,
      }
    });
    if (!account) {
      return respondWithWarning(res, 404, 'Email verification failed');
    }
    if (account && account.verified) {
      return respondWithWarning(res, 202, 'Email already verified');
    }
    if (!account.profile) {
      return respondWithWarning(res, 404, 'Profile does not exist');
    }
    await getConnection()
      .createQueryBuilder()
      .update(Account)
      .set({ verified: true })
      .where('id = :id', { id })
      .execute();
    return respondWithSuccess(res, 200, 'Email verification successful, proceed to login');
  } catch (error) {
      winstonEnvLogger.error({
        message: 'An error occured',
        error
      });
  }
};

export default verifyEmail;
