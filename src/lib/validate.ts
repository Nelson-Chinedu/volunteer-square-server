import winstonEnvLogger from 'winston-env-logger';
import { UserInputError } from 'apollo-server';

import IArgs from '../interfaces/IArgs';

export const validateSignUp = async (args: IArgs) => {
  const { firstname, lastname, email, password } = args;
  try {
    if (firstname.length <= 0) {
      throw new UserInputError('Firstname is Required');
    }

    if (lastname.length <= 0) {
      throw new UserInputError('Lastname is Required');
    }

    if (email.length <= 0) {
      throw new UserInputError('Email Address is Required');
    }

    if (password.length <= 0) {
      throw new UserInputError('Password is Required');
    }
  } catch (error) {
    winstonEnvLogger.error({
      message: 'An error occured',
      error,
    });

    if (error && error.extensions.code === 'BAD_USER_INPUT') {
      throw new UserInputError(error.message);
    }
    throw new Error('An error occured');
  }
};

export const validateSignIn = async (args: IArgs) => {
  const { email, password } = args;
  try {
    if (email.length <= 0) {
      throw new UserInputError('Email Address is Required');
    }

    if (password.length <= 0) {
      throw new UserInputError('Password is Required');
    }
  } catch (error) {
    winstonEnvLogger.error({
      message: 'An error occured',
      error,
    });
    if (error && error.extensions.code === 'BAD_USER_INPUT') {
      throw new UserInputError(error.message);
    }

    throw new Error('An error occured');
  }
};

export const validateUpdateProfile = async (args: IArgs) => {
  const { firstname, lastname, phoneNumber, city, country } = args;
  try {
    if (firstname.length <= 0) {
      throw new UserInputError('Firstname is Required');
    }

    if (lastname.length <= 0) {
      throw new UserInputError('Lastname is Required');
    }

    if (phoneNumber.length <= 0) {
      throw new UserInputError('Phone Number is Required');
    }

    if (city.length <= 0) {
      throw new UserInputError('City is Required');
    }

    if (country.length <= 0) {
      throw new UserInputError('Country is Required');
    }
  } catch (error) {
    winstonEnvLogger.error({
      message: 'An error occured',
      error,
    });
    if (error && error.extensions.code === 'BAD_USER_INPUT') {
      throw new UserInputError(error.message);
    }

    throw new Error('An error occured');
  }
};
