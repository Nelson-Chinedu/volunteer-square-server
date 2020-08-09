import winstonEnvLogger from 'winston-env-logger';
import { getConnection } from 'typeorm';
import { ForbiddenError } from 'apollo-server';

import checkVerification from '../../lib/checkVerification';
import validate from '../../lib/validate';

import { Profile } from '../../db';

import IArgs from '../../interfaces/IArgs';
import IContext from '../../interfaces/IContext';

export default {
  Mutation: {
    updateProfile: async (_parent: any, args: IArgs, context: IContext) => {
      const {  req } = context;
      const { firstname, lastname, phoneNumber, city, country } = args;

      try {
        const user: any = await checkVerification(req);

        if (user) {
          const { profileId } = user;

          if (!profileId) {
            throw new ForbiddenError(user);
          }

          await validate.updateProfile(args);
          await getConnection()
            .createQueryBuilder()
            .update(Profile)
            .set({
              firstname,
              lastname,
              phoneNumber,
              city,
              country,
              updatedAt: new Date().toLocaleString()
            })
            .where('id = :id', {id: profileId})
            .execute();
            return {
              message: 'Profile updated successfully'
            };
        }
      } catch (error) {
        winstonEnvLogger.error({
          message: 'An error occured',
          error,
        });
        throw error;
      }
    }
  }
};
