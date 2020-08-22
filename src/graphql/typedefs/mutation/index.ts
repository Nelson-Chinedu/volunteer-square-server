import { GraphQLObjectType } from 'graphql';
import { ForbiddenError } from 'apollo-server';

import ClientMutation from './client';
import PublicMutation from './public';

export default new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root Mutation for volunteerSqaure',
  fields: () => ({
    client: {
      type: ClientMutation,
      resolve: (_parent, _args, { req: { isAuthorized } }) => {
        if (isAuthorized) {
          return {};
        }
        throw new ForbiddenError('Not authorized');
      },
    },
    public: {
      type: PublicMutation,
      resolve: () => ({}),
    },
  }),
});
