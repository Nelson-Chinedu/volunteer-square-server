import winstonEnvLogger from 'winston-env-logger';

import { Event } from '../../../../db';

import ResolverType from '../../../../interfaces/IResolverType';

const getEvent: ResolverType = async (_parent, args, _context) => {
  const { id } = args;
  try {
    const event = await Event.findOne({
      where: {
        id,
      },
    });
    return event;
  } catch (error) {
    winstonEnvLogger.error({
      message: 'An error occured',
      error,
    });
  }
};

export default getEvent;
