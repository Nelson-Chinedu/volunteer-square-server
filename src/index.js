import dotenv from 'dotenv';
import http from 'http';
import express from 'express';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import bodyParser from 'body-parser';
import cors from 'cors';
import winstonEnvLogger from 'winston-env-logger';
import helmet from 'helmet';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

import models from './db/models';
import typeDefs from "./graphql/typedefs/account";
import resolvers from "./graphql/resolvers/account";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(winstonEnvLogger.logger());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async({req, connection}) => {
    if (req){
      return {
        secret: process.env.SECRET,
        models
      }
    }
  }
});

server.applyMiddleware({app, path: '/graphql'});

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(port, () => {
  winstonEnvLogger.info(`server started on port ${port} `);
});

export default app;
