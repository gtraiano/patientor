import { Request } from "express";
import { DecodedAccessToken } from "../../types";
import config from "../../config";
import { decodeAccessToken, verifyRefreshToken } from '../auth';
import { isMiddlewareInUse, middlewareIndex } from "../util";
import { permissions } from "./permissions";

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
export const authMiddlewareInUse = (req: Request) => isMiddlewareInUse(req, [decodeAccessToken.name, verifyRefreshToken.name]);

export const authMiddlewareInOrder = (req: Request): boolean => {
    const authOrder = middlewareIndex(req, [decodeAccessToken.name, verifyRefreshToken.name]);
    const [permOrder] = middlewareIndex(req, [permissions.name]);

    return authOrder.every(o => o < permOrder);
};