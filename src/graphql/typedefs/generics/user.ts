import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql';

import profileType from './profile';

export default new GraphQLObjectType({
  name: 'user',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    blocked: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    verified: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    profile: {
      type: new GraphQLNonNull(profileType),
    },
  },
});
