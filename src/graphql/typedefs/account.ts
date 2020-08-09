import { gql } from 'apollo-server';

export default gql `
  extend type Query {
    user: User
  }
  extend type Mutation {
    signup(firstname: String!, lastname: String!, email: String!, password: String!): Token!
    signin(email: String!, password: String!): Token!
    verifyEmail: VerificationMessage!
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

  type VerificationMessage {
    message: String!
  }
`;
