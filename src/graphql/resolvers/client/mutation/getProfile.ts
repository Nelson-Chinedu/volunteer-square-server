import { ForbiddenError } from 'apollo-server';
import winstonEnvLogger from 'winston-env-logger';

import { Account } from '../../../../db';

import ResolverType from '../../../../interfaces/IResolverType';

const getProfile: ResolverType = async (
  _parent,
  _args,
  {
    req: {
      decoded: { id: accountId },
    },
  }
) => {
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
    const {
      profile: { firstname, lastname, city, country, phoneNumber },
    } = account;
    return {
      firstname,
      lastname,
      phoneNumber,
      city,
      country,
    };
  } catch (error) {
    winstonEnvLogger.error({
      message: 'An error occured',
      error,
    });
    throw error;
  }
};

export default getProfile;
