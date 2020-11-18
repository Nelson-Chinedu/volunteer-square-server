import { ForbiddenError } from 'apollo-server';
import { getRepository } from 'typeorm';
import winstonEnvLogger from 'winston-env-logger';

import {Account, Event} from '../../../../db';

import ResolverType from '../../../../interfaces/IResolverType';

const getEvents: ResolverType = async (
  _parent,
  { take, skip },
  {
    req: {
      decoded: { id: accountId },
    }
  }
) => {
  try {
    const account = await Account.findOne({
      where:{
        id: accountId
      }
    });

    if(!account){
      throw new ForbiddenError('Account does not exist');
    }

    const events = await getRepository(Event)
      .createQueryBuilder('event')
      .where('event.profile = :profile', { profile: account.profile.id })
      .skip(skip)
      .take(take)
      .getMany();

      return { events };

  } catch (error) {
    winstonEnvLogger.error({
      message: 'An error occured',
      error
    });
  }
};

export default getEvents;