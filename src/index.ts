import dotenv from 'dotenv';
import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import cors, {CorsOptions} from 'cors';
import winstonEnvLogger from 'winston-env-logger';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

const corsOptions: CorsOptions = {
  origin: true,
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(winstonEnvLogger.logger());

const httpServer = http.createServer(app);

httpServer.listen(port, () => {
  winstonEnvLogger.info(`server started on port ${port} `);
});

export default app;
