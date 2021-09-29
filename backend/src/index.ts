import express from 'express';
import cors from 'cors';
import { connect, disconnect } from 'mongoose';
import dotenv = require('dotenv');

import api from './routes/api';
import diagnosesRouter from './routes/diagnoses';
import patientsRouter from './routes/patients';
import ICDCLookupRouter from './routes/icdcodelookup';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.use('/api', api);
app.use('/api/diagnoses', diagnosesRouter);
app.use('/api/patients', patientsRouter);
app.use('/api/icdclookup', ICDCLookupRouter);

const PORT = 3001;

async function connectToDB(): Promise<void> {
    // Connect to MongoDB
    if(!process.env.MONGODB_URI) {
        console.log('MongoDB uri is not set');
        process.exit(0);
    }
    try {
        await connect(process.env.MONGODB_URI as string);
        const uri = process.env.MONGODB_URI.match(/@.+\//);
        console.log(`Connected to MongoDB`, uri ? uri[0] : '');
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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectToDB().catch(err => console.log(err.message));
});

process.on('beforeExit', async () => await disconnectFromDB());
process.on('SIGTERM', async () => {
    await disconnectFromDB();
    console.log('Caught termination signal');
});
process.on('SIGINT', async () => {
    await disconnectFromDB();
    console.log('Caught interrupt signal');
});