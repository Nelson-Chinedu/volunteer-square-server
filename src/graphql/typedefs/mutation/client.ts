import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';

import messageType from '../generics/message';

import UpdateProfileResolver from '../../resolvers/client/mutation/updateProfile';

export default new GraphQLObjectType({
  name: 'ClientMutation',
  description: 'Query accessible to client',
  fields: () => ({
    updateProfile: {
      description: 'Allow user update profile',
      type: messageType,
      args: {
        firstname: { type: new GraphQLNonNull(GraphQLString) },
        lastname: { type: new GraphQLNonNull(GraphQLString) },
        phoneNumber: { type: new GraphQLNonNull(GraphQLString) },
        city: { type: new GraphQLNonNull(GraphQLString) },
        country: { type: new GraphQLNonNull(GraphQLString) },
        imageUrl: { type: GraphQLString },
      },
      resolve: UpdateProfileResolver,
    },
  }),
});
