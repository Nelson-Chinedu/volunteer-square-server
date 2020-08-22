import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';

import messageType from '../generics/message';

import createContactResolver from '../../resolvers/public/mutation/createContact';

export default new GraphQLObjectType({
  name: 'PublicMutation',
  description: 'Query accessible to public',
  fields: () => ({
    createContact: {
      description: 'Allow user to add contact information',
      type: messageType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        address: { type: new GraphQLNonNull(GraphQLString) },
        telephone: { type: new GraphQLNonNull(GraphQLString) },
        eventId: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: createContactResolver,
    },
  }),
});
