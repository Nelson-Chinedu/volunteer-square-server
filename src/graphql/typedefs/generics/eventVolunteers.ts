import { GraphQLObjectType, GraphQLList } from 'graphql';

import volunteer from './volunteer';

export default new GraphQLObjectType({
  name: 'eventVolunteers',
  fields: {
    volunteers: {
      type: new GraphQLList(volunteer),
    },
  },
});
