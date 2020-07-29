import winstonEnvLogger from 'winston-env-logger';
import jwt from 'jsonwebtoken';
import { getConnection } from 'typeorm';

import checkEmail from '../../lib/checkEmail';
import generateToken from '../../lib/generateToken';
import { hashPassword, isValidPassword } from '../../lib/passwordOps';
import validate from '../../lib/validate';
import sendMail from '../../lib/sendMail';

import { Profile, Account } from '../../db';

interface IArgs {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

interface IContext {
  secret: string;
}

interface IVerifyArgs {
  id: string;
  email: string;
  token: string;
}

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
        const userInput = await validate.signUp(args);

        if (userInput) {
          const {message} = userInput;
          if (message){
            return {
              token: '',
              message
            };
          }
        }

        const checkUserEmail = await checkEmail(email);

        if (checkUserEmail) {
          return {
            token: '',
            message: 'Email address already exist'
          };
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
        const mailToken = await generateToken(payload, secret, '7d');
        const mailMessage = {
          name: `Welcome ${firstname} ${lastname}`,
          body: 'Your account have been created suucessfully, click the link below to verify',
          link: `${mailToken}`
        };

        await sendMail(email, mailMessage);
        return {
          token: generateToken({firstname,lastname,email}, secret , '15m'),
          message: 'Account created successfully, A verification mail has been sent to the email provided'
        };
      } catch (error) {
        winstonEnvLogger.error({
          message: 'An error occured',
          error
        });
        throw new Error('An error occured creating account');
      }
    },
    signin: async (_parent: any, args: IArgs, context: IContext ) => {
      const { email, password } = args;
      const { secret } = context;

      try {
        const userInput = await validate.signIn(args);

        if (userInput) {
          const {message} = userInput;
          if (message){
            return {
              token: '',
              message
            };
          }
        }

        const checkUserEmail: any = await checkEmail(email);

        if (!checkUserEmail){
          return {
            token: '',
            message: 'E-mail or password is incorrect'
          };
        }

        const hashedPassword = checkUserEmail.password;
        const checkPassword = await isValidPassword(password, hashedPassword );

        if (!checkPassword) {
          return {
            token: '',
            message: 'E-mail or password is incorrect'
          };
        }

        if (checkUserEmail) {
          const { verified } = checkUserEmail;
          if (verified === 'false'){
            return {
              token: '',
              message: 'Account not verified, Please check your mail for verification link'
            };
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
        throw new Error('An error occured logging in');
      }
    },
    verifyEmail: async (_parent: any, args: IVerifyArgs, context: IContext) => {
      const { secret } = context;

      try {
        const decodeData: any = jwt.verify(args.token, secret);
        if (decodeData) {
          const { email } = decodeData;
          const checkUserEmail: any = await checkEmail(email);

          if (checkUserEmail === undefined || checkUserEmail === null) {
            return {
              message: 'Not authorized'
            };
          }
          if (checkUserEmail){
            const { verified } = checkUserEmail;
            if (verified === 'true'){
              return {
                message: 'Your email address has been verified'
              };
            }
            await getConnection()
              .createQueryBuilder()
              .update(Account)
              .set({verified: true})
              .where('email = :email', {email})
              .execute();
            return {
              message: 'Account verified'
            };
          }
        }
      } catch (error) {
          winstonEnvLogger.error({
            message: 'An error occured',
            error
          });
          if(error && error.message === 'invalid signature'){
            throw new Error('Not authorized');
          }
          if(error && error.message === 'invalid token'){
            throw new Error('Not authorized');
          }
          if(error && error.message === 'jwt expired'){
            const decodePayload: any = jwt.decode(args.token);

            try {
              if (decodePayload){
                const { id, email } = decodePayload;
                const payload = {
                  id,
                  email
                };
                const mailToken = await generateToken(payload, secret, '7d');
                const mailMessage = {
                  name: `Dear ${email}`,
                  body: 'Click the link below to verify your account',
                  link: `${mailToken}`
                };
                await sendMail(email, mailMessage);
                return {
                  message: 'A new verification link has been sent to your email'
                };
              }
            }catch (error) {
              throw new Error('An error occured verifying mail');
            }
          }
      }
    }
  }
};
