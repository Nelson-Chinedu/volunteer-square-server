import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';

import responseType from '../generics/response';
import messageType from '../generics/message';

import SignupResolver from '../../resolvers/public/mutation/signup';
import SigninResolver from '../../resolvers/public/mutation/signin';
import VerifyEmailResolver from '../../resolvers/public/mutation/verifyEmail';

export default new GraphQLObjectType({
  name: 'PublicMutation',
  description: 'Query accessible to public',
  fields: () => ({
    signup: {
      description: 'Allow user create account',
      type: messageType,
      args: {
        firstname: { type: new GraphQLNonNull(GraphQLString) },
        lastname: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: SignupResolver,
    },
    signin: {
      description: 'Allow user to signin',
      type: responseType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: SigninResolver,
    },
    verifyEmail: {
      description: 'Verify user email address',
      type: messageType,
      resolve: VerifyEmailResolver,
    },
  }),
});
