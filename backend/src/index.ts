import app from "./app";
import { connectToDB, disconnectFromDB } from './utils/db';
import config from "./config";

// create https server
if(config.app.PROTOCOLS?.includes('HTTPS')) {
    Promise.all(['https', 'fs'].map(m => import(m))).then(([https, fs]) => {
        const httpsServer = https.createServer({
            key: config.security.https.SSL_KEY ?? fs.readFileSync(config.security.https.SSL_KEY_FILE as string),
            cert: config.security.https.SSL_CRT ?? fs.readFileSync(config.security.https.SSL_CRT_FILE as string),
        }, app);
        
        httpsServer.listen({ port: config.app.PORT, host: config.app.HOST }, () => {
            console.log(`HTTPS server running on port ${config.app.PORT} [host: ${config.app.HOST}]`);
            connectToDB().catch(err => console.log(err.message));
        });
    })
}

// create http server
if(config.app.PROTOCOLS?.includes('HTTP')) {
    import('http').then(http => {
        const port = config.app.PORT + (config.app.PROTOCOLS?.includes('HTTPS') ? 1 : 0);
        const httpServer = http.createServer(app);
        httpServer.listen({ port }, () => {
            console.log(`HTTP server running on port ${port} [host: ${config.app.HOST}]`);
            connectToDB().catch(err => console.log(err.message));
        });
    })
}

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