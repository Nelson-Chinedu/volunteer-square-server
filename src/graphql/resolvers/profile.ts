import winstonEnvLogger from 'winston-env-logger';
import { ForbiddenError, UserInputError } from 'apollo-server';
import jwt from 'jsonwebtoken';
import { getConnection } from 'typeorm';

import checkEmail from '../../lib/checkEmail';
import validate from '../../lib/validate';

import { Profile } from '../../db';

interface IArgs {
  firstname: string;
  lastname: string;
  phoneNumber: string;
  city: string;
  country: string;
  token: string;
  email: string;
  password: string;
}

interface IContext {
  secret: string;
}

export default {
  Mutation: {
    updateProfile: async (_parent: any, args: IArgs, context: IContext) => {
      const { secret } = context;
      const {firstname, lastname, phoneNumber, city, country, token } = args;

      try {
        const decodeData: any = jwt.verify(token, secret);

        if (decodeData) {
          const { email } = decodeData;
          const checkUserEmail: any = await checkEmail(email);
          if (checkUserEmail === undefined || checkUserEmail === null) {
            throw new ForbiddenError('Not authorized');
          }
          if (checkUserEmail) {
            const {verified, profile} = checkUserEmail;

            if (verified === 'false') {
              throw new ForbiddenError('Not authorized');
            }

          const checkUserInput = await validate.updateProfile(args);

          if (checkUserInput) {
            const { message } = checkUserInput;
            throw new UserInputError(message);
          }
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
              .where('id = :id', {id: profile.id})
              .execute();
            return {
              message: 'Profile updated successfully'
            };
          }
        }
      } catch (error) {
          winstonEnvLogger.error({
            message: 'An error occured',
            error
          });
          if (error && error.message === 'invalid token') {
            throw new Error('Not authorized');
          }
          if (error && error.message === 'invalid signature') {
            throw new Error('Not authorized');
          }
          if (error && error.extensions.code === 'BAD_USER_INPUT') {
            throw new UserInputError(error.message);
          }
          throw new Error('An error occured updating profile');
      }
    }
  }
};
