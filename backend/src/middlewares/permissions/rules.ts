import { UserRole, UserRoles } from "../../types";
import { CustomError } from "../error";
import config from '../../config';

interface MethodRule {
    params: boolean,
    allow: (roles: UserRole[], sourceId: string, targetId?: string) => boolean
}

interface RouteRule {
    [method: string]: MethodRule[]
}

const rules = new Map<string, RouteRule>();
// users route rules
rules.set(
    `${config.routes.api.root}${config.routes.api.users}`,
    {
        'GET': [
            {
                params: true,
                allow: (roles: UserRole[], sourceId: string, targetId?: string) => {
                    const allowed = roles.find(r => r.name === UserRoles.Admin) !== undefined || sourceId === targetId;
                    if(!allowed) throw new CustomError(`You have no permission to access user id ${targetId ?? ''}`, 401);
                    return allowed;
                    
                }
            },
            {
                params: false,
                allow: () => true
            }
        ],
        'PUT': [
            {
                params: true,
                allow: (roles: UserRole[], sourceId: string, targetId?: string) => {
                    const allowed = roles.find(r => r.name === UserRoles.Admin) !== undefined || sourceId === targetId;
                    if(!allowed) throw new CustomError(`You have no permission to edit user id ${targetId ?? ''}`, 401);
                    return allowed;
                }
            }
        ],
        'POST': [
            {
                params: true,
                allow: () => true
            }
        ],
        'DELETE': [
            {
                params: true,
                allow: (roles: UserRole[], sourceId: string, targetId?: string) => {
                    const allowed = roles.find(r => r.name === UserRoles.Admin) !== undefined || sourceId === targetId;
                    if(!allowed) throw new CustomError(`You have no permission to delete user id ${targetId ?? ''}`, 401);
                    return allowed;
                }
            }
        ]
    },
);

// patients route rules
rules.set(
    `${config.routes.api.root}${config.routes.api.patients}`,
    {
        'GET': [
            {
                params: false,
                allow: () => true
            },
            {
                params: true,
                allow: () => true
            }
        ],
        'PUT': [
            {
                params: true,
                allow: (roles: UserRole[], sourceId: string, targetId?: string) => roles.find(r => r.name === UserRoles.Admin) !== undefined || sourceId === targetId
            }
        ],
        'POST': [
            {
                params: false,
                allow: () => true
            }
        ]
    }
);

// diagnoses routes rules
rules.set(
    `${config.routes.api.root}${config.routes.api.diagnoses}`,
    {
        'GET': [
            {
                params: false,
                allow: () => true
            },
            {
                params: true,
                allow: () => true
            }
        ],
        'POST': [
            {
                params: false,
                allow: () => true
            }
        ],
        'PUT': [
            {
                params: true,
                allow: () => true
            }
        ],
        'DELETE': [
            {
                params: true,
                allow: (roles: UserRole[], ..._args) => roles.find(r => r.name === UserRoles.Admin) !== undefined
            }
        ],
    }
);

rules.set(
    `${config.routes.api.root}${config.routes.api.ping}`,
    {
        'GET': [
            {
                params: false,
                allow: () => true
            }
        ]
    }
)

export default rules;