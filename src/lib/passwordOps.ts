import bcrypt from 'bcrypt';
import winstonEnvLogger from 'winston-env-logger';

export const hashPassword = async (password: string) => {
  const salt = 10;
  try {
    return await bcrypt.hash(password, salt);
  } catch (error) {
    winstonEnvLogger.error({
      message: 'An error occured',
      error,
    });
    throw new Error('An error occured');
  }
};

export const isValidPassword = async (
  password: string,
  hashedPassword: string
) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    winstonEnvLogger.error({
      message: 'An error occured',
      error,
    });
    throw new Error('An error occured');
  }
};
