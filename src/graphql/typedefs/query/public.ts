import winstonEnvLogger from 'winston-env-logger';
import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import userType from '../generics/user';
import eventsType from '../generics/eventCategory';
import eventType from '../generics/event';

import getEventsResolver from '../../resolvers/public/query/getEventsResolver';
import getEventResolver from '../../resolvers/public/query/getEventResolver';

export default new GraphQLObjectType({
  name: 'PublicQuery',
  description: 'Query accessible to the public',
  fields: () => ({
    user: {
      type: userType,
      resolve: (_parent, _args, _context) => {
        winstonEnvLogger.info('Query');
      },
    },
    getAllEvents: {
      description: 'Query accessible to get all event',
      type: eventsType,
      args: {
        category: { type: GraphQLString },
        take: { type: new GraphQLNonNull(GraphQLInt) },
        skip: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: getEventsResolver,
    },
    getEvent: {
      description: 'Query accessible to get single event',
      type: eventType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: getEventResolver,
    },
  }),
});
