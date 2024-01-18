import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express, { json, urlencoded } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import schema from './schema/index.js';
import auth from './middlewares/auth.js';

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
  auth,
  cors(),
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
