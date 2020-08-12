import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
} from 'graphql';

export default new GraphQLObjectType({
  name: 'profile',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    firstname: {
      type: new GraphQLNonNull(GraphQLString),
    },
    lastname: {
      type: new GraphQLNonNull(GraphQLString),
    },
    city: {
      type: GraphQLString,
    },
    country: {
      type: GraphQLString,
    },
    phoneNumber: {
      type: GraphQLString,
    },
    imageUrl: {
      type: GraphQLString,
    },
  },
});
