import { GraphQLObjectType } from 'graphql';

import { ForbiddenError } from 'apollo-server';

import PublicQuery from './public';
import ClientQuery from './client';

export default new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query for volunteer Square',
  fields: () => ({
    public: {
      type: PublicQuery,
      resolve: () => ({}),
    },
    client: {
      type: ClientQuery,
      resolve: (_parent, _args, { req: { isAuthorized } }) => {
        if (isAuthorized) {
          return {};
        }
        throw new ForbiddenError('Not authorized');
      },
    },
  }),
});
