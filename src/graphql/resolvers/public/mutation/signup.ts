import winstonEnvLogger from 'winston-env-logger';
import { UserInputError } from 'apollo-server';

import {validateSignUp} from '../../../../lib/validate';
import checkEmail from '../../../../lib/checkEmail';
import { hashPassword } from '../../../../lib/passwordOps';
import generateToken from '../../../../lib/generateToken';
import sendMail from '../../../../lib/sendMail';

import { Profile, Account } from '../../../../db';

import ResolverType from '../../../../interfaces/IResolverType';

const signup: ResolverType = async (_parent, args, { secret }) => {
  const { firstname, lastname, email, password } = args;
  try {
    await validateSignUp(args);
    const user = await checkEmail(email);

    if (user) {
      throw new UserInputError('Email address already exist');
    }

    const hashedPassword = await hashPassword(password);

    const profile = Profile.create({
      firstname,
      lastname,
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
      email: account.email,
    };

    const mailToken = generateToken(payload, secret, '7d');
    const mailMessage = {
      name: `Welcome ${firstname} ${lastname}`,
      body:
        'Your account have been created suucessfully, click the link below to verify',
      link: `${mailToken}`,
    };

    await sendMail(email, mailMessage);
    return {
      message:
        'Account created successfully, A verification mail has been sent to the email provided',
    };
  } catch (error) {
    winstonEnvLogger.error({
      message: 'An error occured',
      error,
    });
    if (error && error.message === 'An error occured sending mail') {
      throw new Error(
        'Account created successfully, But verification email was not sent successfully'
      );
    }
    throw error;
  }
};

export default signup;
