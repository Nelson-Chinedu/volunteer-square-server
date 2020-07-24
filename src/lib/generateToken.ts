import winstonEnvLogger from 'winston-env-logger';
import jwt from 'jsonwebtoken';

export default async (user: any, secret: string, expiresIn: string) => {
  try {
    return await jwt.sign(user, secret, {expiresIn});
  } catch (error) {
    winstonEnvLogger.error({
      message: 'An error occured',
      error
    });
    throw new Error('An error occured');
  }
};
