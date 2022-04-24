import express from 'express';

import cors from 'cors';
import cookieParser from 'cookie-parser';
import { decodeAccessToken, verifyRefreshToken } from './middlewares/auth';
import { isOperationAllowed } from './middlewares/permissions/permissions';
import errorMiddleware from './middlewares/error'

import ping from './routes/ping';
import diagnosesRouter from './routes/diagnoses';
import patientsRouter from './routes/patients';
import ICDCLookupRouter from './routes/icdcodelookup';
import usersRouter from './routes/users';
import authRouter from './routes/auth';
import config from './config';

const app = express();

// no middleware involved
app.use(`${config.routes.api.root}${config.routes.api.ping}`, ping);

// middlewares
app.use(express.json());
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(cookieParser());
app.use(decodeAccessToken);
app.use(verifyRefreshToken);
app.use(isOperationAllowed);
app.use(errorMiddleware.auth.authErrorHandler);

// routes
app.use(`${config.routes.api.root}${config.routes.api.auth}`, authRouter);
app.use(`${config.routes.api.root}${config.routes.api.diagnoses}`, diagnosesRouter);
app.use(`${config.routes.api.root}${config.routes.api.patients}`, patientsRouter);
app.use(`${config.routes.api.root}${config.routes.api.icdc}`, ICDCLookupRouter);
app.use(`${config.routes.api.root}${config.routes.api.users}`, usersRouter);

// error handling
app.use(errorMiddleware.db.dbErrorHandler);
app.use(errorMiddleware.general.generalErrorHandler);

export default app;