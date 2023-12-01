import { makeExecutableSchema } from '@graphql-tools/schema';
import merge from 'lodash.merge';
import { typeDefs as User, resolvers as userResolvers } from './user/index.js';
import { typeDefs as Task, resolvers as taskResolvers } from './task/index.js';
import {
  typeDefs as Label,
  resolvers as labelResolvers,
} from './label/index.js';

export default makeExecutableSchema({
  typeDefs: [User, Task, Label],
  resolvers: merge(userResolvers, taskResolvers, labelResolvers),
});
