import { makeExecutableSchema } from '@graphql-tools/schema';
import merge from 'lodash.merge';
import gql from 'graphql-tag';

export default makeExecutableSchema({
  typeDefs: [
    gql`
      type Query {
        hello: String
      }
    `,
  ],
  resolvers: merge({
    Query: {
      hello: () => 'world',
    },
  }),
});
