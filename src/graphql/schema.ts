import { GraphQLSchema } from 'graphql';

import query from './typedefs/query';
import mutation from './typedefs/mutation';

export default new GraphQLSchema({
  query,
  mutation
});