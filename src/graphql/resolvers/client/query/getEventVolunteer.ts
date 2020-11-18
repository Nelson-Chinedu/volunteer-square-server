import { ForbiddenError } from 'apollo-server';
import { getRepository } from 'typeorm';
import winstonEnvLogger from 'winston-env-logger';
import { Account, Contact } from '../../../../db';
import IResolver from '../../../../interfaces/IResolverType';

const viewEventVolunteer: IResolver = async (
  _parent,
  {eventId},
  {
    req: {
      decoded: { id: accountId }
    }
  }
) => {
  try {
    const account = await Account.findOne({
      where: {
        id: accountId
      }
    });

    if (!account) {
      throw new ForbiddenError('Account does not exist');
    }

    const volunteers = await getRepository(Contact)
      .createQueryBuilder('contact')
      .where('contact.event = :event', {event: eventId})
      .getMany();

      return { volunteers };

  } catch (error) {
    winstonEnvLogger.error({
      message: 'An error occured',
      error
    });
  }
};

export default viewEventVolunteer;