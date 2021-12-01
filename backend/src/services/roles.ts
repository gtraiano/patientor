import Role from '../models/Role';
import { Roles } from '../types';

const initializeRoles = async (): Promise<void> => {
    if(await Role.estimatedDocumentCount() === 0) {
        const addedRoles: [string?] = [];
        for(const role of Object.values(Roles)) {
            try {
                await new Role({
                    name: role
                })
                .save();
                addedRoles.push(role);
            }
            catch(error) {
                console.log(error);
            }
        };
        console.log(`Added roles ${addedRoles.join(', ')} to ${Role.modelName}`);
    }
}

export default {
    initializeRoles
}