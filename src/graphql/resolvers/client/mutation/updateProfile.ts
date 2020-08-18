import { getConnection } from 'typeorm';
import { ForbiddenError } from 'apollo-server';
import winstonEnvLogger from 'winston-env-logger';

import { Profile, Account } from '../../../../db';

import ResolverType from '../../../../interfaces/IResolverType';

const updateProfile: ResolverType = async (
  _parent,
  args,
  {
    req: {
      decoded: { id: accountId },
    },
  }
) => {
  try {
    const { firstname, lastname, phoneNumber, city, country } = args;
    const account = await Account.findOne({
      where: { id: accountId },
      relations: ['profile'],
    });

    if (!account) {
      throw new ForbiddenError('Account does not exist');
    }

    await getConnection()
      .createQueryBuilder()
      .update(Profile)
      .set({
        firstname,
        lastname,
        phoneNumber,
        city,
        country,
        updatedAt: new Date().toLocaleString(),
      })
      .where('id = :id', { id: account.profile.id })
      .execute();
    return {
      message: 'Profile updated successfully',
    };
  } catch (error) {
    winstonEnvLogger.error({
      message: 'An error occured',
      error,
    });
    throw error;
  }
};

export default updateProfile;
