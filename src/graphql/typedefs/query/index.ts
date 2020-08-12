import winstonEnvLogger from 'winston-env-logger';
import { GraphQLObjectType } from 'graphql';

import PublicQuery from './public';

export default new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query for volunteer Square',
  fields: () => ({
    public: {
      type: PublicQuery,
      resolve: () => {
        winstonEnvLogger.info('Query');
      },
    },
  }),
});
