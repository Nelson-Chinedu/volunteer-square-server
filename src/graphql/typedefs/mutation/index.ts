import { GraphQLObjectType } from 'graphql';
import { ForbiddenError } from 'apollo-server';

import PublicMutation from './public';
import ClientMutation from './client';

export default new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root Mutation for volunteerSqaure',
  fields: () => ({
    public: {
      type: PublicMutation,
      resolve: () => ({}),
    },
    client: {
      type: ClientMutation,
      resolve: (_parent, _args, { req: { user } }) => {
        if (!user) {
          throw new ForbiddenError('Not authorized');
        }
        return {};
      },
    },
  }),
});
