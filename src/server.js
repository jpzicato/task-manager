import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express, { json } from 'express';
import http from 'http';
import cors from 'cors';
import schema from './schema/index.js';
import logger from './logs/logger.js';
import envVars from './config/envVars.js';

try {
  const app = express();

  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use('/', cors(), json(), expressMiddleware(server));

  await new Promise(resolve =>
    httpServer.listen({ port: envVars.PORT }, resolve)
  );

  logger.info('Apollo server successfully started');
} catch (error) {
  const errorMsg = `Error starting Apollo server: ${error}`;

  logger.error(errorMsg);

  throw errorMsg;
}
