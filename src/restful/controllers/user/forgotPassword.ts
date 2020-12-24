import winstonEnvLogger from 'winston-env-logger';
import {Request, Response} from 'express';

import { Account } from '../../../db';

import { respondWithWarning, respondWithSuccess } from '../../../lib/httpResponse';
import { createToken } from '../../../lib/token';
import sendMail from '../../../lib/sendMail';

const forgotPassword = async (req: Request, res: Response) => {
  const {email} = req.body;
  try {
    const account: Account | undefined = await Account.findOne({
      where: {
        email
      }
    });
    if (!account) {
      return respondWithWarning(
        res,
        403,
        `We sent an email to ${email} with instructions to reset your password.`
      );
    }
    if (process.env.NODE_ENV === 'production'){
    const {id, profile: {firstname, lastname }} = account;
    const token = createToken(
      { id },
      process.env.VERIFICATION_JWT_kEY as string,
      '1h'
    );
    const mailMessage = {
      name: `Hi ${firstname} ${lastname}`,
      body: `A request to reset your Account password has been made.
             If you did not make this request, simply ignore this email.
             If you did make this request, please reset your password`,
      route: 'reset-password',
      query: 'token',
      verificationLink: `${token}`,
    };
    await sendMail(email, mailMessage);
  }
    return respondWithSuccess(
        res,
        200,
        `We sent an email to ${email} with instructions to reset your password.`
      );
  } catch (error) {
    winstonEnvLogger.error({
      message: 'An error occured',
      error
    });
    if (error && error.message === 'An error occured sending mail') {
      return respondWithWarning(
        res,
        500,
        'Password reset link was not sent succesfully, please try again'
      );
    }
    return respondWithWarning(res, 500, 'An error occured');
  }
};

export default forgotPassword;
