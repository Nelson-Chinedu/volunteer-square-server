import { GraphQLObjectType, GraphQLID, GraphQLString } from 'graphql';

export default new GraphQLObjectType({
  name: 'profile',
  fields: {
    id: {
      type: GraphQLID,
    },
    firstname: {
      type: GraphQLString,
    },
    lastname: {
      type: GraphQLString,
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
