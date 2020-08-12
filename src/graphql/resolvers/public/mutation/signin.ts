import winstonEnvLogger from 'winston-env-logger';
import { AuthenticationError } from 'apollo-server';

import { validateSignIn } from '../../../../lib/validate';
import checkEmail from '../../../../lib/checkEmail';
import { isValidPassword } from '../../../../lib/passwordOps';
import { createAccessToken, createRefreshToken, sendRefreshToken } from '../../../../lib/auth';

import ResolverType from '../../../../interfaces/IResolverType';

const signin: ResolverType = async (_parent, args, { res }) => {
  const { email, password } = args;
  try {
    await validateSignIn(args);
    const user: any = await checkEmail(email);

    if (!user) {
      throw new AuthenticationError('Incorrect Email address or Password');
    }

    const hashedPassword = user.password;
    const matchedPassword = await isValidPassword(password, hashedPassword);

    if (!matchedPassword) {
      throw new AuthenticationError('Incorrect Email address or password');
    }

    if (user) {
      const { verified } = user;

      if (verified === 'false') {
        throw new AuthenticationError(
          'Account not verified, Please check your mail for verification link'
        );
      }
    }
    sendRefreshToken(res, createRefreshToken(user));

    return {
      token: createAccessToken(user),
      message: 'Logged in successfully',
    };
  } catch (error) {
    winstonEnvLogger.error({
      message: 'An error occured',
      error,
    });
    throw error;
  }
};

export default signin;
