import config from "../../config";

export type RequestMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'PTACH' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE';

export interface Rule {
    path: string,   // request path
    match: boolean  // path must match
}

export type MethodRule = {
    [key in RequestMethod as string]: Array<Rule>;
};

export interface MiddlewareRules {
    [key: string]: MethodRule
}

export const middlewareRules: MiddlewareRules = {
    decodeAccessToken: {
        'POST': [ // must not be executed on POST /api/auth or POST /api/users
            { path: `${config.routes.api.root}${config.routes.api.auth}`, match: true },
            { path: `${config.routes.api.root}${config.routes.api.users}`, match: true }
        ]
    },
    verifyRefreshToken: {
        'PUT': [ // must be executed only on PUT /api/auth
            { path: `${config.routes.api.root}${config.routes.api.auth}`, match: false }
        ]
    }
};