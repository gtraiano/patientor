import { app, connectToDB, disconnectFromDB } from "./app";
import config from "./config";

app.listen(config.app.PORT, () => {
    console.log(`Server running on port ${config.app.PORT}`);
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