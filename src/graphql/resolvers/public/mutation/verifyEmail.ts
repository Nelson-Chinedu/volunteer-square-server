import winstonEnvLogger from 'winston-env-logger';
import { ForbiddenError } from 'apollo-server';
import { getConnection } from 'typeorm';

import { emailVerification } from '../../../../lib/emailVerification';

import { Account } from '../../../../db';

import ResolverType from '../../../../interfaces/IResolverType';

const verifyEmail: ResolverType = async (_parent, _args, { req }) => {
  try {
    const user: any = await emailVerification(req);

    if (user) {
      const { id, message } = user;

      if (message) {
        return { message };
      }

      if (!id) {
        throw new ForbiddenError(user);
      }

      await getConnection()
        .createQueryBuilder()
        .update(Account)
        .set({ verified: true })
        .where('id = :id', { id })
        .execute();
      return {
        message: 'Account verified',
      };
    }
  } catch (error) {
    winstonEnvLogger.error({
      message: 'An error occured',
      error,
    });
    throw error;
  }
};

export default verifyEmail;
