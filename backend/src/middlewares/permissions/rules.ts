import { UserRole, UserRoles } from "../../types";
import { CustomError } from "../error";

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
    '/api/users',
    {
        'GET': [
            {
                params: true,
                allow: (roles: UserRole[], sourceId: string, targetId?: string) => {
                    const allowed = roles.find(r => r.name === UserRoles.Admin) !== undefined || sourceId === targetId;
                    if(!allowed) throw new CustomError(`You have no permission to access user id ${targetId ? targetId : ''}`, 401);
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
                    if(!allowed) throw new CustomError(`You have no permission to edit user id ${targetId ? targetId : ''}`, 401);
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
                    if(!allowed) throw new CustomError(`You have no permission to delete user id ${targetId ? targetId : ''}`, 401);
                    return allowed;
                }
            }
        ]
    },
);

// patients route rules
rules.set(
    '/api/patients',
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
    '/api/diagnoses',
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
                allow: () => true
            }
        ],
    }
);

export default rules;