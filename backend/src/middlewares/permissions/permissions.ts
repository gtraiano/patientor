import { NextFunction, Request, Response } from 'express';
import config from '../../config';
import rules from './rules';
import { CustomError } from '../error';
import { authMiddlewareInUse, extractAccessToken, parseUrlPath } from './helper';

export const isOperationAllowed = (req: Request, _res: Response, next: NextFunction): void => {
    try {
        // do not run on auth route
        if(req.path === `${config.routes.api.root}${config.routes.api.auth}`) return next();

        // if auth middleware is not in use, no user auth info has been appended to request object
        // thus it is impossible to apply operation permissions
        if(!authMiddlewareInUse(req)) return next();
        
        // user token
        const user = extractAccessToken(req);
        // request url route and id
        const url = parseUrlPath(req.path);

        // find method for route with request method and id as criteria
        const rule = rules.get(url.route || '')?.[req.method]?.find((r: any) => r.params === (url.id !== undefined));

        if(rule) {
            console.log('has rules', url.route && rules.has(url.route), url.route && rules.get(url.route)?.[req.method]?.find((r: any) => r.params === (url.id !== undefined)));
            if(typeof rule.allow === 'boolean') {
                console.log('operation allowed', rule);
                // throw general message error on false return value
                if(!rule.allow) throw new CustomError('operation is not allowed', 401);
            }
            else if(typeof rule.allow === 'function') {
                const allowed = rule.allow(req, user.id, url.id);
                // in case rule.allow does not throw error when it returns false value, throw a general message error
                if(typeof allowed === 'boolean') {
                    console.log('operation allowed', allowed);
                    if(!allowed) throw new CustomError('operation is not allowed', 401);
                }
                if(allowed instanceof Promise) {
                    // needs to be resolved and handle errors
                    return void allowed.then(ok => {
                        console.log('operation allowed', ok);
                        return !ok
                            ? next(new CustomError('operation is not allowed', 401))
                            : next();
                    })
                    .catch(e => {
                        next(e ?? new CustomError('operation is not allowed', 401));
                    });
                }
            }
        }
        else {
            console.log(`no rule found for ${req.method} ${url.route} ${url.id || ''}`);
        }

        next();
    }
    catch(e) {
        next(e ?? new CustomError('operation is not allowed', 401));
    }
};
