import winstonEnvLogger from 'winston-env-logger';
import { AuthenticationError, UserInputError, ForbiddenError } from 'apollo-server';
import { getConnection } from 'typeorm';

import checkEmail from '../../lib/checkEmail';
import generateToken from '../../lib/generateToken';
import { hashPassword, isValidPassword } from '../../lib/passwordOps';
import validate from '../../lib/validate';
import sendMail from '../../lib/sendMail';
import checkEmailVerification from '../../lib/checkEmailVerification';

import { Profile, Account } from '../../db';

import IArgs from '../../interfaces/IArgs';
import IContext from '../../interfaces/IContext';

export default {
  Query: {
    user: async (_parent: any, _args: any, _context: IContext) => {
      return {email: 'Hello'};
    }
  },
  Mutation: {
    signup: async (_parent: any, args: IArgs, context: IContext) => {
      const { firstname, lastname, email, password } = args;
      const { secret } = context;

      try {
        await validate.signUp(args);

        const checkUserEmail = await checkEmail(email);

        if (checkUserEmail) {
          throw new UserInputError('Email address already exist');
        }

        const hashedPassword = await hashPassword(password);

        const profile = Profile.create({
          firstname,
          lastname
        });
        await profile.save();

        const account = Account.create({
          email,
          password: hashedPassword,
          profile,
        });
        await account.save();

        const payload = {
          id: account.id,
          email: account.email
        };
        const mailToken = generateToken(payload, secret, '7d');
        const mailMessage = {
          name: `Welcome ${firstname} ${lastname}`,
          body: 'Your account have been created suucessfully, click the link below to verify',
          link: `${mailToken}`
        };

        await sendMail(email, mailMessage);
        return {
          message: 'Account created successfully, A verification mail has been sent to the email provided'
        };
      } catch (error) {
        winstonEnvLogger.error({
          message: 'An error occured',
          error
        });

        if (error && error.message === 'An error occured sending mail') {
          throw new Error('Account created successfully, But verification email was not sent successfully');
        }
        throw error;
      }
    },
    signin: async (_parent: any, args: IArgs, context: IContext ) => {
      const { email, password } = args;
      const { secret } = context;

      try {
        await validate.signIn(args);

        const checkUserEmail: any = await checkEmail(email);

        if (!checkUserEmail) {
          throw new AuthenticationError('E-mail or password is incorrect');
        }

        const hashedPassword = checkUserEmail.password;
        const checkPassword = await isValidPassword(password, hashedPassword );

        if (!checkPassword) {
          throw new AuthenticationError('E-mail or password is incorrect');
        }

        if (checkUserEmail) {
          const { verified } = checkUserEmail;

          if (verified === 'false') {
            throw new AuthenticationError('Account not verified, Please check your mail for verification link');
          }
        }

        return {
          token: generateToken({ email, id: checkUserEmail.id }, secret , '15m'),
          message: 'Logged in successfully'
        };
      } catch (error) {
        winstonEnvLogger.error({
          message: 'An error occured',
          error
        });

        if (error && error.extensions.code === 'UNAUTHENTICATED') {
          throw new AuthenticationError(error.message);
        }

        throw error;
      }
    },
    verifyEmail: async (_parent: any, _args: IArgs, context: IContext) => {
      const { secret, req } = context;

      try {
        const user: any = await checkEmailVerification(req, secret);
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
            .set({verified: true})
            .where('id = :id', {id})
            .execute();
            return {
              message: 'Account verified'
            };
        }
      } catch (error) {
          winstonEnvLogger.error({
            message: 'An error occured',
            error
          });
          throw error;
      }
    }
  }
};
