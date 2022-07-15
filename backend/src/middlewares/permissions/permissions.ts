import { NextFunction, Request, Response } from 'express';
import config from '../../config';
import rules from './rules';
import { DecodedAccessToken } from '../../types';
import { CustomError } from '../error';

/**
 * @param path  url path
 * @param depth path depth
 * @returns part of url path between [depth, depth + 1] number of forward slashes
 */
const parseUrlPathId = (path: string, depth: number = 2): string | undefined => {
    return path.split('/')[depth + 1];
}

const parseUrlPathRoute = (path: string, depth: number = 2): string | undefined => {
    return path.split('/').slice(0, depth + 1).join('/');
}

const parseUrlPath = (path:string) : {
    route: string | undefined, id: string | undefined, secondaryId: string | undefined
} => {
    const route = parseUrlPathRoute(path);
    const id = parseUrlPathId(path);
    const secondaryId = parseUrlPathId(path, 4);

    return { route, id, secondaryId };
};

export const isOperationAllowed = (req: Request, _res: Response, next: NextFunction): void => {
    // do not run on auth route
    if(req.path === `${config.routes.api.root}${config.routes.api.auth}`) return next();
    // user token
    const user: DecodedAccessToken = (req as any)[config.accessToken.name];
    // request url route and id
    const url = parseUrlPath(req.path);
    
    // find method for route with request method and id as criteria
    const rule = rules.get(url.route || '')?.[req.method]?.find((r: any) => r.params === (url.id !== undefined));
    if(rule) {
        console.log('has rules', url.route && rules.has(url.route), url.route && rules.get(url.route)?.[req.method]?.find((r: any) => r.params === (url.id !== undefined)));
        console.log('operation allowed', rule?.allow(user.roles, user.id, url.id));
        if(!rule?.allow(user.roles, user.id, url.id)) return next(new CustomError('operation is not allowed', 401));
    }
    else {
        console.log(`no rule found for ${req.method} ${url.route} ${url.id || ''}`);
    }
    
    next();
};
