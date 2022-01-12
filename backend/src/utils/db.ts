import { connect, disconnect } from "mongoose";
import rolesService from '../services/roles';
import config from "../config";

export async function connectToDB(): Promise<void> {
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

export const disconnectFromDB = async (): Promise<void> => {
    await disconnect();
    console.log('Disconnected from MongoDB');
}