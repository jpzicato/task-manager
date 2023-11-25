import gql from 'graphql-tag';

export default gql`
  input SignUpInput {
    name: String!
    email: String!
    password: String!
    repeatPassword: String!
  }

  input LogInInput {
    email: String!
    password: String!
  }

  input RefreshTokenInput {
    refreshToken: String!
  }

  input UpdateUserInput {
    name: String
    email: String
    password: String
  }

  type Tokens {
    accessToken: String!
    refreshToken: String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    user: User
  }

  type Mutation {
    signUp(input: SignUpInput!): Tokens
    logIn(input: LogInInput!): Tokens
    renewAccessToken(input: RefreshTokenInput!): Tokens
    logOut(input: RefreshTokenInput!): String

    updateUser(edits: UpdateUserInput!): User
    deleteUser: String
  }
`;
