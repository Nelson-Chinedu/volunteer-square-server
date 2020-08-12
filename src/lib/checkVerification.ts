import winstonEnvLogger from 'winston-env-logger';

import verifyEmail from './verifyEmail';

export default async (email: string) => {
  try {
    const checkVerification: any = await verifyEmail(email);

    if (checkVerification) {
      const {
        verified,
        profile: { id },
      } = checkVerification;

      if (verified === 'false') {
        return 'Not authorized';
      } else {
        return { profileId: id };
      }
    }
  } catch (error) {
    winstonEnvLogger.error({
      message: 'An error occured',
      error,
    });
    throw new Error('An error occured');
  }
};
