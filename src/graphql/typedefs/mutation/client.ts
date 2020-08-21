import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';

import messageType from '../generics/message';

import UpdateProfileResolver from '../../resolvers/client/mutation/updateProfile';
import createEventResolver from '../../resolvers/client/mutation/createEvent';

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
    createEvent: {
      description: 'Allow user to create an event',
      type: messageType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        category: { type: new GraphQLNonNull(GraphQLString) },
        location: { type: new GraphQLNonNull(GraphQLString) },
        time: { type: new GraphQLNonNull(GraphQLString) },
        date: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: createEventResolver,
    },
  }),
});
