import { UserRoles } from "../../types";
import { CustomError } from "../error";
import config from '../../config';
import BaseEntry from "../../models/Entry/BaseEntry";
import { RouteRule } from "./types";
import { Request } from "express";
import { extractAccessToken } from "./helper";
import Patient from "../../models/Patient";

const rules = new Map<string, RouteRule>();
// users route rules
rules.set(
    `${config.routes.api.root}${config.routes.api.users}`,
    {
        'GET': [
            {
                params: true,
                allow: (req: Request, sourceId: string, targetId?: string): boolean => {
                    const { roles } = extractAccessToken(req);
                    const allowed = roles.find(r => r.name === UserRoles.Admin) !== undefined || sourceId === targetId;
                    if(!allowed) throw new CustomError(`You have no permission to access user id ${targetId ?? ''}`, 401);
                    return allowed;
                    
                }
            },
            {
                params: false,
                allow: true
            }
        ],
        'PUT': [
            {
                params: true,
                allow: (req: Request, sourceId: string, targetId?: string): boolean => {
                    const { roles } = extractAccessToken(req);
                    const allowed = roles.find(r => r.name === UserRoles.Admin) !== undefined || sourceId === targetId;
                    if(!allowed) throw new CustomError(`You have no permission to edit user id ${targetId ?? ''}`, 401);
                    return allowed;
                }
            }
        ],
        'POST': [
            {
                params: true,
                allow: true
            }
        ],
        'DELETE': [
            {
                params: true,
                allow: (req: Request, sourceId: string, targetId?: string): boolean => {
                    const { roles } = extractAccessToken(req);
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
                allow: true
            },
            {
                params: true,
                allow: true
            }
        ],
        'PUT': [
            {
                params: true,
                allow: async (req: Request, _sourceId: string, _targetId?: string): Promise<boolean> => {
                    // auth user token
                    const { id, roles } = extractAccessToken(req);
                    // entity to be edited id
                    const entityId = (req.url.match(/[^/]+$/g) as RegExpMatchArray)[0];
                    
                    // admin role can always edit
                    if(roles.findIndex(r => r.name === UserRoles.Admin) !== -1) return true;
                    
                    // editing entry
                    if(req.url.includes('entries')) {
                        const entry = await BaseEntry.findById(entityId);
                        if(id !== String(entry?.authorId)) throw new CustomError('You have no permission to edit this entry', 401);
                        return id === String(entry?.authorId);
                    }
                    // editing patient
                    else {
                        const patient = await Patient.findById(entityId);
                        if(id !== String(patient?._id)) throw new CustomError('You have no permission to edit this patient', 401);
                        return id === String(patient?._id);
                    }
                }
            }
        ],
        'PATCH': [
            {
                params: true,
                allow: async (req: Request, _sourceId: string, _targetId?: string): Promise<boolean> => {
                    // auth user token
                    const { id, roles } = extractAccessToken(req);
                    // entity to be edited id
                    const entityId = (req.url.match(/[^/]+$/g) as RegExpMatchArray)[0];
                    
                    // admin role can always edit
                    if(roles.findIndex(r => r.name === UserRoles.Admin) !== -1) return true;
                    
                    // editing entry
                    if(req.url.includes('entries')) {
                        const entry = await BaseEntry.findById(entityId);
                        if(id !== String(entry?.authorId)) throw new CustomError('You have no permission to edit this entry', 401);
                        return id === String(entry?.authorId);
                    }
                    // editing patient
                    else {
                        const patient = await Patient.findById(entityId);
                        if(id !== String(patient?._id)) throw new CustomError('You have no permission to edit this patient', 401);
                        return id === String(patient?._id);
                    }
                }
            }
        ],
        'POST': [
            {
                params: false,
                allow: true
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
                allow: true
            },
            {
                params: true,
                allow: true
            }
        ],
        'POST': [
            {
                params: false,
                allow: true
            }
        ],
        'PUT': [
            {
                params: true,
                allow: true
            }
        ],
        'DELETE': [
            {
                params: true,
                allow: (req: Request, _sourceId: string, _targetId?: string): boolean => extractAccessToken(req).roles.find(r => r.name === UserRoles.Admin) !== undefined
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
                allow: true
            }
        ]
    }
);

export default rules;