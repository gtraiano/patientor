import express from 'express';

import cors from 'cors';
import cookieParser from 'cookie-parser';
import { decodeAccessToken, verifyRefreshToken } from './middlewares/auth';
import { extractUserRoles } from './middlewares/permissions';
import errorMiddleware from './middlewares/error'

import ping from './routes/ping';
import diagnosesRouter from './routes/diagnoses';
import patientsRouter from './routes/patients';
import ICDCLookupRouter from './routes/icdcodelookup';
import usersRouter from './routes/users';
import authRouter from './routes/auth';

const app = express();

// no middleware involved
app.use('/api/ping', ping);

// middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(decodeAccessToken);
app.use(verifyRefreshToken);
app.use(extractUserRoles);
app.use(errorMiddleware.auth.authErrorHandler);

// routes
app.use('/api/auth', authRouter);
app.use('/api/diagnoses', diagnosesRouter);
app.use('/api/patients', patientsRouter);
app.use('/api/icdclookup', ICDCLookupRouter);
app.use('/api/users', usersRouter);

// error handling
app.use(errorMiddleware.db.dbErrorHandler);
app.use(errorMiddleware.general.generalErrorHandler);

export default app;