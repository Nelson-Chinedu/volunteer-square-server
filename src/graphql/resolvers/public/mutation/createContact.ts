import { UserInputError } from 'apollo-server';
import winstonEnvLogger from 'winston-env-logger';

import { Contact } from '../../../../db';

import ResolverType from '../../../../interfaces/IResolverType';

import getContactError from '../../../../lib/getContactError';

const createContact: ResolverType = async (_parent, args, _context) => {
  const { name, address, telephone, eventId } = args;

  try {
    const contactError = getContactError(args);
    if (contactError) {
      const { message } = contactError;
      throw new UserInputError(message);
    }

    const newContact = Contact.create({
      name,
      address,
      telephone,
      event: eventId,
    });
    await newContact.save();
    return {
      message: 'Contact sent sucessfully',
    };
  } catch (error) {
    winstonEnvLogger.error({
      message: 'An error occured',
      error,
    });
    throw error;
  }
};

export default createContact;
