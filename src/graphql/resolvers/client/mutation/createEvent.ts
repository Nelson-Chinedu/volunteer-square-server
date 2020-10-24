import { ForbiddenError, UserInputError } from 'apollo-server';
import winstonEnvLogger from 'winston-env-logger';
import dayJs from 'dayjs';

import { Account, Event } from '../../../../db';

import getEventError from '../../../../lib/getEventError';

import ResolverType from '../../../../interfaces/IResolverType';

const createEvent: ResolverType = async (
  _parent,
  args,
  {
    req: {
      decoded: { id: accountId },
    },
  }
) => {
  const { name, description, category, location, time, date } = args;

  const formatDate = dayJs(date).format('MMM DD, YYYY');
  const formatTime = dayJs(time).format('h:mm A');

  try {
    const account = await Account.findOne({
      where: {
        id: accountId,
      },
      relations: ['profile'],
    });
    if (!account) {
      throw new ForbiddenError('Account does not exist');
    }

    const eventError = getEventError(args);
    if (eventError) {
      const { message } = eventError;
      throw new UserInputError(message);
    }
    const newEvent = Event.create({
      name,
      description,
      category,
      location,
      time: formatTime,
      date: formatDate,
      profile: account.profile,
    });
    await newEvent.save();
    return { message: 'Event Created Successfuly' };
  } catch (error) {
    winstonEnvLogger.error({
      message: 'An error occured',
      error,
    });
    throw error;
  }
};

export default createEvent;
