import app from "./app";
import { connectToDB, disconnectFromDB } from './utils/db';
import config from "./config";
import https from 'https';
import fs from 'fs';

const httpsServer = https.createServer({
    key: config.security.https.SSL_KEY ?? fs.readFileSync(config.security.https.SSL_KEY_FILE as string),
    cert: config.security.https.SSL_CRT ?? fs.readFileSync(config.security.https.SSL_CRT_FILE as string),
}, app);

httpsServer.listen({ port: config.app.PORT, host: config.app.HOST }, () => {
    console.log(`Server running on port https://${config.app.HOST}:${config.app.PORT}`);
    connectToDB().catch(err => console.log(err.message));
});

// exit cleanup functions
process.on('beforeExit', async () => await disconnectFromDB());
process.on('SIGTERM', async () => {
    await disconnectFromDB();
    console.log('Caught termination signal');
});
process.on('SIGINT', async () => {
    await disconnectFromDB();
    console.log('Caught interrupt signal');
});