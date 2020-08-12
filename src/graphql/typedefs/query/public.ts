import winstonEnvLogger from 'winston-env-logger';

import {GraphQLObjectType} from 'graphql';
import userType from '../generics/user';

export default new GraphQLObjectType({
  name: 'PublicQuery',
  description: 'Query accessible to the public',
  fields: () => ({
    user: {
      type: userType,
      resolve: (_parent, _args, _context) => {
        winstonEnvLogger.info('Query');
      }
    }
  })
});
