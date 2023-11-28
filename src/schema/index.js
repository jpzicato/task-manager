import { makeExecutableSchema } from '@graphql-tools/schema';
import merge from 'lodash.merge';
import { typeDefs as User, resolvers as userResolvers } from './user/index.js';
import { typeDefs as Task, resolvers as taskResolvers } from './task/index.js';

export default makeExecutableSchema({
  typeDefs: [User, Task],
  resolvers: merge(userResolvers, taskResolvers),
});
