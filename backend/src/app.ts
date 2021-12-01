import config from './config';
import express from 'express';
import { connect, disconnect } from 'mongoose';

import cors from 'cors';
import cookieParser from 'cookie-parser';
import { decodeAccessToken, verifyRefreshToken } from './middlewares/auth';
import errorMiddleware from './middlewares/error'

import ping from './routes/ping';
import diagnosesRouter from './routes/diagnoses';
import patientsRouter from './routes/patients';
import ICDCLookupRouter from './routes/icdcodelookup';
import usersRouter from './routes/users';
import authRouter from './routes/auth';

import rolesService from './services/roles';

const app = express();

// no middleware involved
app.use('/api/ping', ping);

// middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(decodeAccessToken);
app.use(verifyRefreshToken);
//app.use(isUserLoggedIn);
app.use(errorMiddleware.auth.authErrorHandler);

// routes
app.use('/api/auth', authRouter);
app.use('/api/diagnoses', diagnosesRouter);
app.use('/api/patients', patientsRouter);
app.use('/api/icdclookup', ICDCLookupRouter);
app.use('/api/users', usersRouter);

async function connectToDB(): Promise<void> {
    // Connect to MongoDB
    if(!config.db.MONGODB_URI) {
        console.log('MongoDB uri is not set');
        process.exit(0);
    }
    try {
        await connect(config.db.MONGODB_URI as string);
        const uri = config.db.MONGODB_URI.match(/@.+\//);
        console.log(`Connected to MongoDB`, uri ? uri[0] : '');
        await rolesService.initializeRoles();
    }
    catch(error: any) {
        console.log(error.message);
        process.exit(1);
    }
}

const disconnectFromDB = async (): Promise<void> => {
    await disconnect();
    console.log('Disconnected from MongoDB');
}

export {
    app,
    connectToDB,
    disconnectFromDB
};