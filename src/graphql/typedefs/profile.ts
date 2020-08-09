import { gql } from 'apollo-server';

export default gql `
  extend type Mutation {
    updateProfile(
      firstname: String,
      lastname: String,
      phoneNumber: String,
      city: String,
      country: String,
      imageUrl: String
      ): Message
  }

  type Message {
    message: String!
  }

`;