import { getRepository } from 'typeorm';
import winstonEnvLogger from 'winston-env-logger';

import { Event } from '../../../../db';

import ResolverType from '../../../../interfaces/IResolverType';

const getEvents: ResolverType = async (
  _parent,
  { category, take, skip },
  _context
) => {
  try {
    const events = await getRepository(Event)
      .createQueryBuilder('event')
      .where(category ? 'event.category = :category' : '1=1', { category })
      .skip(skip)
      .take(take)
      .getMany();

    return { events };
  } catch (error) {
    winstonEnvLogger.error({
      message: 'An error occured',
      error,
    });
  }
};

export default getEvents;
