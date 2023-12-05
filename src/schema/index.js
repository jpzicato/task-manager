import { makeExecutableSchema } from '@graphql-tools/schema';
import merge from 'lodash.merge';
import { typeDefs as User, resolvers as userResolvers } from './user/index.js';
import { typeDefs as Task, resolvers as taskResolvers } from './task/index.js';
import {
  typeDefs as Label,
  resolvers as labelResolvers,
} from './label/index.js';
import {
  typeDefs as Project,
  resolvers as projectResolvers,
} from './project/index.js';

export default makeExecutableSchema({
  typeDefs: [User, Task, Label, Project],
  resolvers: merge(
    userResolvers,
    taskResolvers,
    labelResolvers,
    projectResolvers
  ),
});
