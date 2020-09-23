import { GraphQLObjectType } from 'graphql';

import profileType from '../generics/profile';

import getProfileResolver from '../../resolvers/client/mutation/getProfile';

export default new GraphQLObjectType({
  name: 'ClientQuery',
  description: 'Query accessible to client',
  fields: () => ({
    getUserProfile: {
      description: 'Get user profile details',
      type: profileType,
      resolve: getProfileResolver,
    },
  }),
});
