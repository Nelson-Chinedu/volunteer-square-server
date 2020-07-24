import winstonEnvLogger from 'winston-env-logger';

import { Account } from '../db';

const checkEmail = async (email: string) => {
  try {
    return await Account.findOne({
      where: {
        email
      }
    });
  } catch (error) {
    winstonEnvLogger.error({
      message: 'An error occured',
      error
    });
    throw new Error('An error occured');
  }
};

export default checkEmail;
