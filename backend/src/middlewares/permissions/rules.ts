import { UserRoles } from "../../types";
import { CustomError } from "../error/error";
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
                allow: (req: Request, primaryId: string, secondaryId?: string): boolean => {
                    // an admin can view any id, a user can only view their own id
                    const { roles } = extractAccessToken(req);
                    const allowed = roles.find(r => r.name === UserRoles.Admin) !== undefined || primaryId === secondaryId;
                    if(!allowed) throw new CustomError(`You have no permission to access user id ${secondaryId ?? ''}`, 401);
                    return allowed;
                    
                }
            },
            {
                params: false,
                allow: true // any role can get aggregate list of all users
            }
        ],
        'PUT': [
            {
                params: true,
                allow: (req: Request, primaryId: string, secondaryId?: string): boolean => {
                    // an admin can change any user, a user can only change their own id
                    const { roles } = extractAccessToken(req);
                    const allowed = roles.find(r => r.name === UserRoles.Admin) !== undefined || primaryId === secondaryId;
                    if(!allowed) throw new CustomError(`You have no permission to edit user id ${secondaryId ?? ''}`, 401);
                    return allowed;
                }
            }
        ],
        'POST': [
            {
                params: true,
                allow: true // any role can create a new user
            }
        ],
        'DELETE': [
            {
                params: true,
                allow: (req: Request, primaryId: string, secondaryId?: string): boolean => {
                    // an admin can delete any user, a user can only delete their own id
                    const { roles } = extractAccessToken(req);
                    const allowed = roles.find(r => r.name === UserRoles.Admin) !== undefined || primaryId === secondaryId;
                    if(!allowed) throw new CustomError(`You have no permission to delete user id ${secondaryId ?? ''}`, 401);
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
            // any role can get an aggregate list of patients
            {
                params: false,
                allow: true
            },
            // any role can get a patient by id
            {
                params: true,
                allow: true
            }
        ],
        'PUT': [
            // an admin can both edit a patient and an entry
            // a user can only edit an entry which they have authored
            {
                params: true,
                allow: async (req: Request, _primaryId: string, _secondaryId?: string): Promise<boolean> => {
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
            // same rules as for PUT
            {
                params: true,
                allow: async (req: Request, _primaryId: string, _secondaryId?: string): Promise<boolean> => {
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
            // any user can create a patient or an entry
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
            // any role can get an aggregate list of diagnoses
            {
                params: false,
                allow: true
            },
            // any role can get an a specific diagnosis by id
            {
                params: true,
                allow: true
            }
        ],
        'POST': [
            // any role can create a new diagnosis
            {
                params: false,
                allow: true
            }
        ],
        'PUT': [
            // any role can change a diagnosis
            {
                params: true,
                allow: true
            }
        ],
        'DELETE': [
            // only an admin may delete a diagnosis
            {
                params: true,
                allow: (req: Request, _primaryId: string, _secondaryId?: string): boolean => extractAccessToken(req).roles.find(r => r.name === UserRoles.Admin) !== undefined
            }
        ],
    }
);

// ping route
rules.set(
    `${config.routes.api.root}${config.routes.api.ping}`,
    {
        'GET': [
            // any user may use the ping route to check for api online status
            {
                params: false,
                allow: true
            }
        ]
    }
);

export default rules;