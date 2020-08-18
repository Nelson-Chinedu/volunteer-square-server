import winstonEnvLogger from 'winston-env-logger';
import { Request, Response } from 'express';

import { Account, Profile } from '../../../db';

import { respondWithSuccess } from '../../../lib/httpResponse';
import { createToken } from '../../../lib/token';
import sendToEmail from '../../../lib/sendMail';

const signup = async (req: Request, res: Response) => {
  const { firstname, lastname, email, password } = req.body;
  try {
    const newProfile = Profile.create({
      firstname,
      lastname,
    });
    await newProfile.save();

    const newAccount = Account.create({
      email,
      password,
      profile: newProfile,
    });

    await newAccount.save();
    const token: string = createToken(
      { id: newAccount.id },
      process.env.VERIFICATION_JWT_kEY as string,
      '7d'
    );
    const mailMessage = {
      name: `Welcome ${firstname} ${lastname}`,
      body: 'Please click the link below to verify account',
      route: 'verify-email',
      query: 'token',
      verificationLink: `${token}`,
    };

    await sendToEmail(email, mailMessage);
    return respondWithSuccess(
      res,
      201,
      'Please check your email to verify account'
    );
  } catch (error) {
    if (error && error.message === 'An error occured sending mail') {
      return respondWithSuccess(
        res,
        201,
        'Account created succesfully, but verification email was not sent'
      );
    }
    winstonEnvLogger.error({
      message: 'An error occured',
      error,
    });
  }
};

export default signup;
