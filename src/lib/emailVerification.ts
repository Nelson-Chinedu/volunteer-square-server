import winstonEnvLogger from 'winston-env-logger';

import verifyEmail from './verifyEmail';
import sendMail from './sendMail';
import generateToken from './generateToken';
import { decodeToken } from './checkToken';

import IReq from '../interfaces/IReq';

export const emailVerification = async (req:IReq) => {
  const { user } = req;

  try {
    if (!user) {
      return 'Not authorized';
    }
    if (user) {
      const {accessToken} = user;
      const decoded: any = decodeToken(accessToken);

      if (decoded) {
        const { id, email } = decoded;
        const payload = {
          id,
          email
        };
        const mailToken = generateToken(payload, process.env.EMAIL_TOKEN_SECRET!, '7d');
        const mailMessage = {
          name: `Dear ${email}`,
          body: 'Click the link below to verify your account',
          link: `${mailToken}`
        };
        await sendMail(email, mailMessage);
        return {
          message: 'A new verification link has been sent to your email',
          id
        };
      }
    }
    const checkVerification: any = await verifyEmail(user.email);
    if (!checkVerification){
      return 'Not authorized';
    }
    if (checkVerification) {
      const { verified } = checkVerification;
      if (verified === 'true') {
        return { message: 'Your email address has been verified' };
      }
    }
    if (checkVerification) {
      const { id } = checkVerification;
        return { id };
      }
  } catch (error) {
      winstonEnvLogger.error({
        message: 'An error occured',
        error
      });

      if (error && error.message === 'An error occured sending mail') {
        throw new Error('An error occured sending verification mail. Please try again');
      }
      throw new Error('An error occured');
  }
};
