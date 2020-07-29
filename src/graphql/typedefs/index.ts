import {gql} from 'apollo-server';

import account from './account';
import profile from './profile';

const linkSchema = gql `
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }
`;

export default [linkSchema, account, profile];
