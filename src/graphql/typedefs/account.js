import { gql } from 'apollo-server';

export default gql `
  type Query {
    user: User
  }
  type Mutation {
    account(firstname: String!, lastname: String!, email: String!, password: String!): Token!
  }

  type Token {
    token: String!
    message: String!
  }

  type User {
    email: String
    password: String
    verified: Boolean
    createdAt: String
    updatedAt: String
  }
`