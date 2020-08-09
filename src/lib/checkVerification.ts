import winstonEnvLogger from 'winston-env-logger';

import verifyEmail from './verifyEmail';

import IReq from '../interfaces/IReq';

export default async (req: IReq) => {
  const { user } = req;

  try {
    if (!user) {
      return 'Not authorized';
    }
    const checkVerification: any = await verifyEmail(user.email);

    if (checkVerification) {
      const { verified, profile:{ id } } = checkVerification;
      if (verified === 'false') {
        return 'Not authorized';
      }else{
        return { profileId: id };
      }
    }
  } catch (error) {
      winstonEnvLogger.error({
        message: 'An error occured',
        error
      });
      throw new Error('An error occured');
  }
};
