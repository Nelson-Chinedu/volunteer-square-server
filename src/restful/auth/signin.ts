import { Request, Response } from 'express';
import winstonEnvLogger from 'winston-env-logger';

import { Account } from '../../db';

import { isValidPassword } from '../../lib/passwordOps';
import { createToken } from '../../lib/token';
import sendToEmail from '../../lib/sendMail';
import { respondWithWarning, respondWithSuccess } from '../../lib/httpResponse';

const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const account: Account | undefined = await Account.findOne({
      where: {
        email,
      },
    });

    if (
      !account ||
      (account && !(await isValidPassword(password, account.password)))
    ) {
      return respondWithWarning(res, 404, 'Incorrect email or password');
    }

    if (account && account.blocked) {
      return respondWithWarning(
        res,
        400,
        'Account blocked, kindly contact an administrator to resolve'
      );
    }

    if (account && !account.verified) {
      if(process.env.NODE_ENV === 'production'){
        const verificationToken: string = createToken(
          { id: account.id },
          process.env.VERIFICATION_JWT_kEY as string,
          '7d'
        );
        const { firstname, lastname } = account.profile;

        const mailMessage = {
          name: `Dear ${firstname} ${lastname}`,
          body: 'Please click the link below to verify your account',
          route: 'verify-email',
          query: 'token',
          verificationLink: `${verificationToken}`,
        };
        await sendToEmail(email, mailMessage);
      }

      return respondWithWarning(
        res,
        400,
        'Account not verified, Kindly check your mail to verify account'
      );
    }
    const token = createToken(
      { id: account.id },
      process.env.JWT_KEY as string,
      '7d'
    );
    return respondWithSuccess(res, 200, 'Logged in successfully', { token });
  } catch (error) {
    winstonEnvLogger.error({
      message: 'An error occured',
      error,
    });
    if (error && error.message === 'An error occured sending mail') {
      return respondWithWarning(
        res,
        500,
        'Account not verified and verification link was not sent succesfully, please try again'
      );
    }
    return respondWithWarning(res, 500, 'Login not successful');
  }
};

export default signin;
