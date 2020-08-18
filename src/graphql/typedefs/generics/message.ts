import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';

export default new GraphQLObjectType({
  name: 'message',
  fields: {
    message: { type: new GraphQLNonNull(GraphQLString) },
  },
});
