import { GraphQLError } from 'graphql';

export default (msg, code) =>
  new GraphQLError(msg, {
    extensions: {
      code,
    },
  });
