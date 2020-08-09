import winstonEnvLogger from 'winston-env-logger';
import jwt from 'jsonwebtoken';

import IUser from '../interfaces/IUser';

export default (user: IUser, secret: string, expiresIn: string) => {
  try {
    return jwt.sign(user, secret, {expiresIn});
  } catch (error) {
    winstonEnvLogger.error({
      message: 'An error occured',
      error
    });
    throw new Error('An error occured');
  }
};
