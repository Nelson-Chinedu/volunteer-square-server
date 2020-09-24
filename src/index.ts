import '@babel/polyfill';
import 'reflect-metadata';
import 'dotenv/config';
import http from 'http';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import bodyParser from 'body-parser';
import cors, { CorsOptions } from 'cors';
import winstonEnvLogger from 'winston-env-logger';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { createConnection } from 'typeorm';

import schema from './graphql/schema';

import jwtAuthMiddleware from './restful/middleware/jwtAuthMiddleware';
import routes from './restful/routes';

const app = express();
const port = process.env.PORT || 8000;
const corsOptions: CorsOptions = {
  origin: true,
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(winstonEnvLogger.logger());
app.use(jwtAuthMiddleware);

const server = new ApolloServer({
  schema,
  context: async ({ req, res }) => {
    if (req) {
      return {
        req,
        res,
      };
    }
  },
});
routes(app);

server.applyMiddleware({ app, path: '/graphql' });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

createConnection()
  .then(() => {
    httpServer.listen(port, () => {
      winstonEnvLogger.info(`server started on port ${port} `);
    });
  })
  .catch(error => {
    winstonEnvLogger.error({
      message: 'An error occured',
      error,
    });
    throw new Error('An error occured connecting to database');
  });

export default app;
