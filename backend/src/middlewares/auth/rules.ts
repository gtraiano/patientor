import config from "../../config";
import { decodeAccessToken, verifyRefreshToken } from "./auth";

export type RequestMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | '*';
// asterisk serves as a wildcard or as the remaining methods for which rules have not been set

export interface ExecutionPreventionRule {
    path: string | RegExp,  // request path
    prevent: boolean        // prevent execution
}

// rules per request method
export type RequestMethodExecutionPreventionRule = {
    [key in RequestMethod]?: Array<ExecutionPreventionRule>
};

// set of rules per middleware function
export interface MiddlewareExecutionPreventionRules {
    [key: string]: RequestMethodExecutionPreventionRule,
}

export const middlewareRules: MiddlewareExecutionPreventionRules = {
    [decodeAccessToken.name]: {
        // must NOT be executed on POST /api/auth or POST /api/users
        'POST': [
            { path: `${config.routes.api.root}${config.routes.api.auth}`, prevent: true },
            { path: `${config.routes.api.root}${config.routes.api.users}`, prevent: true }
        ],
        // execute on all other methods and paths
        '*': [
            { path: /.*/g, prevent: false }
        ]
    },
    [verifyRefreshToken.name]: {
        // must be executed only on PUT /api/auth
        'PUT': [
            { path: `${config.routes.api.root}${config.routes.api.auth}`, prevent: false },
        ],
        // do not execute on all other methods and paths
        '*': [
            { path: /.*/g, prevent: true }
        ]
    }
};

/**
 * @param component     middleware function name (provided by Function.name)
 * @param method        request method
 * @param path          request path
 * @returns             prevent property value of defined rule for component/request method & path combination, or false if no rule exists
 */
export const preventExecution = (component: string, method: RequestMethod, path: string): boolean => {
    const rule = middlewareRules[component][method]?.find(r => r.path instanceof RegExp ? r.path.test(path) : r.path === path)
        ?? middlewareRules[component]['*']?.find(r => r.path instanceof RegExp ? r.path.test(path) : r.path === path);
    console.log(component, method, path, rule, 'prevent execution', rule?.prevent ?? false);
    return rule?.prevent ?? false;
};