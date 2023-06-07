import { NextFunction, Request, Response } from 'express';
import config from '../../config';
import rules from './rules';
import { CustomError } from '../error/error';
import { authMiddlewareInUse, extractAccessToken, parseUrlPath } from './helper';
import { asyncHandler, unloadMiddleware } from '../util';

export const isOperationAllowed = async (req: Request, _res: Response, next: NextFunction) => {
    // if auth middleware is not in use, no user auth info has been appended to request object
    // thus it is impossible to apply operation permissions
    if(!authMiddlewareInUse(req)) {
        // so we remove middleware from app stack
        console.warn('auth middleware not in use!');
        console.warn('unloading permissions middleware');
        unloadMiddleware(req, permissions.name);
        return next();
    }

    // do not run on auth route
    if(req.path === `${config.routes.api.root}${config.routes.api.auth}`) return next();

    let opAllowed = true, error: Error | null = null;

    try {
        // user token
        const user = extractAccessToken(req);
        // request url route and id
        const url = parseUrlPath(req.path);

        // find method for route with request method and id as criteria
        const rule = rules.get(url.route || '')?.[req.method]?.find((r: any) => r.params === (url.id !== undefined));

        if(rule) {
            console.log('has rules', url.route && rules.has(url.route), url.route && rules.get(url.route)?.[req.method]?.find((r: any) => r.params === (url.id !== undefined)));
            if(typeof rule.allow === 'boolean') {
                opAllowed = rule.allow;
                // throw general message error on false return value
                if(!rule.allow) throw new CustomError('operation is not allowed', 401);
            }
            else if(typeof rule.allow === 'function') {
                const allowed = rule.allow(req, user.id, url.id);
                // in case rule.allow does not throw error when it returns false value, throw a general message error
                if(typeof allowed === 'boolean') {
                    opAllowed = allowed;
                    if(!allowed) throw new CustomError('operation is not allowed', 401);
                }
                else if(allowed instanceof Promise) {
                    // needs to be resolved and handle errors
                    opAllowed = await Promise.resolve(allowed);
                    if(!opAllowed) throw new CustomError('operation is not allowed', 401);
                }
            }
        }
        else {
            console.log(`no rule found for ${req.method} ${url.route} ${url.id || ''}`);
        }
    }
    catch(e) {
        error = e as Error;
        // operation not allowed if there was an error
        opAllowed = false;
    }
    finally {
        console.log('allowed', opAllowed, 'error', error?.message);
        // continue to next middleware
        next(
            error
                ? error ?? new CustomError('operation is not allowed', 401)
                : undefined
        );
    }
};

export function permissions(req: Request, res: Response, next: NextFunction) {
    asyncHandler(isOperationAllowed)(req, res, next);
}