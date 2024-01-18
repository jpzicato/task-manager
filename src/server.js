import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express, { json, urlencoded } from 'express';
import { createServer } from 'http';
import schema from './schema/index.js';
import authMiddleware from './middlewares/auth.js';
import corsMiddleware from './middlewares/cors.js';

const app = express();

const httpServer = createServer(app);

const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({
      httpServer,
    }),
  ],
});

await server.start();

app.use(
  '/',
  corsMiddleware,
  authMiddleware,
  json(),
  urlencoded({
    extended: false,
  }),
  expressMiddleware(server, {
    context: async ({ req: { userId, error } }) => ({
      userId,
      error,
    }),
  })
);

export default httpServer;
