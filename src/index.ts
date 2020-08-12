import 'dotenv/config';
import 'reflect-metadata';
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
import jwtAuthMiddleware from './middleware/jwtAuthMiddleware';
import { verifyToken } from './lib/checkToken';
import checkEmail from './lib/checkEmail';
import { createAccessToken, createRefreshToken, sendRefreshToken } from './lib/auth';

const app = express();
const port = process.env.PORT || 8000;
const corsOptions:CorsOptions = {
  origin: true,
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(winstonEnvLogger.logger());
app.use(jwtAuthMiddleware);

const server = new ApolloServer({
  schema,
  context: async({req, res}) => {
    if (req) {
      return {
        secret: process.env.SECRET,
        req,
        res
      };
    }
  }
});

server.applyMiddleware({app, path: '/graphql'});

app.post('/refresh_token', async (req, res) => {
  const token = req.cookies.sotAmJViUg;
  if (!token) {
    winstonEnvLogger.error({
      message: 'token missing',
    });
    return res.status(400).send({token: false, accessToken: ''});
  }
  try {
    const payload: any = verifyToken(token, process.env.REFRESH_TOKEN_SECRET!);
    if (payload) {
      const { email } = payload;
      const user: any = await checkEmail(email);

      sendRefreshToken(res, createRefreshToken(user));
      return res.send({token: true, accessToken: createAccessToken(user)});
    }
  } catch (error) {
    winstonEnvLogger.error({
      message: 'An error occured',
      error
    });
    if (error) {
      return res.status(400).send({token: false, accessToken: ''});
    }
  }
});

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
