import winstonEnvLogger from 'winston-env-logger';
import { ForbiddenError } from 'apollo-server';
import { getConnection } from 'typeorm';

import checkVerification from '../../../../lib/checkVerification';
import { validateUpdateProfile } from '../../../../lib/validate';

import { Profile } from '../../../../db';

import ResolverType from '../../../../interfaces/IResolverType';

const updateProfile: ResolverType = async (
  _parent,
  args,
  { req: { user } }
) => {
  try {
    const { email } = user;
    const { firstname, lastname, phoneNumber, city, country } = args;
    const profile: any = await checkVerification(email);
    if (profile) {
      const { profileId } = profile;

      if (!profileId) {
        throw new ForbiddenError(profile);
      }

      await validateUpdateProfile(args);
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
        .where('id = :id', { id: profileId })
        .execute();
      return {
        message: 'Profile updated successfully',
      };
    }
  } catch (error) {
    winstonEnvLogger.error({
      message: 'An error occured',
      error,
    });
    throw error;
  }
};

export default updateProfile;
