import { makeExecutableSchema } from '@graphql-tools/schema';
import merge from 'lodash.merge';
import { typeDefs as User, resolvers as userResolvers } from './user/index.js';

export default makeExecutableSchema({
  typeDefs: [User],
  resolvers: merge(userResolvers),
});
