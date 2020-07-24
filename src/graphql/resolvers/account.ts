import checkEmail from '../../lib/checkEmail';
import generateToken from '../../lib/generateToken';
import { hashPassword, isValidPassword } from '../../lib/passwordOps';
import validate from '../../lib/validate';

import { Profile, Account } from '../../db';

interface IArgs {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

interface IContext {
  secret: string | number;
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
      });
      await account.save();

      return {
        token: generateToken({firstname,lastname,email}, secret , '15m'),
        message: 'Account created successfully'
      };
    },
    signin: async (_parent: any, args: IArgs, context: IContext ) => {
      const { email, password } = args;
      const { secret } = context;

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

      const checkUserEmail = await checkEmail(email);

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

      return {
        token: generateToken({ email, id: checkUserEmail.id }, secret , '15m'),
        message: 'Logged in successfully'
      };
    }
  }
};
