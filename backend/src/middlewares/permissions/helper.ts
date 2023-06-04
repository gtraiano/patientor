import Layer, { Request } from "express";
import { DecodedAccessToken } from "../../types";
import config from "../../config";
import { decodeAccessToken, verifyRefreshToken } from '../auth';

export const extractAccessToken = (req: Request) => (req as any)[config.accessToken.name] as DecodedAccessToken;

/**
 * @param path  url path
 * @param depth path depth
 * @returns part of url path between [depth, depth + 1] number of forward slashes
 */
const parseUrlPathId = (path: string, depth = 2): string | undefined => {
    return path.split('/')[depth + 1];
};

const parseUrlPathRoute = (path: string, depth = 2): string | undefined => {
    return path.split('/').slice(0, depth + 1).join('/');
};

export const parseUrlPath = (path:string) : {
    route: string | undefined, id: string | undefined, secondaryId: string | undefined
} => {
    const route = parseUrlPathRoute(path);
    const id = parseUrlPathId(path);
    const secondaryId = parseUrlPathId(path, 4);

    return { route, id, secondaryId };
};

// checks if auth middleware is in use
export const authMiddlewareInUse = (req: Request) => {
    //if(!req.app._router) return false;
    const stack = req.app._router.stack as Array<typeof Layer> ?? [];
    return (
        stack.findIndex(l => l.name === decodeAccessToken.name) !== -1 &&
        stack.findIndex(l => l.name === verifyRefreshToken.name) !== -1
    );
};

export const isMiddlewareInUse = (req: Request, names: string[]): boolean => {
    const stack = req.app._router.stack as Array<typeof Layer> ?? [];
    return stack.reduce<boolean>((all, l) => all && names.includes(l.name), true);
};