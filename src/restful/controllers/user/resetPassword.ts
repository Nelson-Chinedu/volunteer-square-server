import winstonEnvLogger from 'winston-env-logger';
import {Request, Response} from 'express';
import { getConnection } from 'typeorm';

import { Account } from '../../../db';

import { verifyEmailToken } from '../../../lib/token';
import { respondWithSuccess, respondWithWarning } from '../../../lib/httpResponse';
import { hashPassword } from '../../../lib/passwordOps';

const resetPassword = async (req: Request, res: Response) => {
  const token = req.body.token;
  let password = req.body.password;
  try {
    const verifiedToken: any = verifyEmailToken(token as string);
    const { id } = verifiedToken;
    const account: Account | undefined = await Account.findOne({
      where: {
        id,
      }
    });
    if (!account) {
      return respondWithWarning(res, 403, 'Password reset unauthorized');
    }

    password = await hashPassword(password);

    await getConnection()
      .createQueryBuilder()
      .update(Account)
      .set({password})
      .where('id = :id', { id })
      .execute();

      return respondWithSuccess(res, 201, 'Password reset successfully');
  } catch (error) {
      winstonEnvLogger.error({
        message: 'An errror occured',
        error
      });
      return respondWithWarning(res, 500, 'Password reset unauthorized');
  }
};

export default resetPassword;
