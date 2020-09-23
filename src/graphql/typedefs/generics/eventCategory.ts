import { GraphQLObjectType, GraphQLList } from 'graphql';

import eventType from './event';

export default new GraphQLObjectType({
  name: 'eventCategory',
  fields: {
    events: {
      type: new GraphQLList(eventType),
    },
  },
});
