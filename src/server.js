import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express, { json } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import schema from './schema/index.js';
import logger from './logs/logger.js';
import auth from './middlewares/auth.js';

try {
  const app = express();

  const httpServer = createServer(app);

  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    '/',
    auth,
    cors(),
    json(),
    expressMiddleware(server, {
      context: async ({ req: { userId, error } }) => ({ userId, error }),
    })
  );

  await new Promise(resolve =>
    httpServer.listen(
      {
        port: 8080,
      },
      resolve
    )
  );

  logger.info('Apollo server successfully started');
} catch (error) {
  const errorMsg = `Error starting Apollo server: ${error}`;

  logger.error(errorMsg);

  throw errorMsg;
}
