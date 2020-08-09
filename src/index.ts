import 'reflect-metadata';
import dotenv from 'dotenv';
import http from 'http';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import bodyParser from 'body-parser';
import cors from 'cors';
import winstonEnvLogger from 'winston-env-logger';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { createConnection } from 'typeorm';

import typeDefs from './graphql/typedefs';
import resolvers from './graphql/resolvers';
import jwtAuthMiddleware from './middleware/jwtAuthMiddleware';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(winstonEnvLogger.logger());
app.use(jwtAuthMiddleware);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async({req}) => {
    if (req) {
      return {
        secret: process.env.SECRET,
        req
      };
    }
  }
});

server.applyMiddleware({app, path: '/graphql'});

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

createConnection().then(() => {
  httpServer.listen(port, () => {
    winstonEnvLogger.info(`server started on port ${port} `);
  });
}).catch(error => {
  winstonEnvLogger.error({
    message: 'An error occured',
    error
  });
  throw new Error('An error occured connecting to database');
});

export default app;
