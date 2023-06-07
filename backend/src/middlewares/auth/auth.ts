import { NextFunction, Request, Response } from 'express';
import jwt, { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import RefreshToken from '../../models/RefreshToken';
import authServices, { InvalidCredentials } from '../../services/auth';
import config from '../../config';
import { DecodedAccessToken, RefreshToken as IRefreshToken } from '../../types';
import { preventExecution, RequestMethod } from './rules';
import { asyncHandler } from '../util';
import { extractAccessToken } from '../permissions/helper';

// returns authorization token value from Request object
const extractAuthToken = (request: Request): string | null => {
    const authorization = request.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7);
    }
    return null;
};

// decode access token and append it to Request object
function decodeAccessToken(req: Request, _res: Response, next: NextFunction) {
    if(preventExecution(decodeAccessToken.name, req.method as RequestMethod, req.path)) return next();
    try {
        const token = extractAuthToken(req);
        const decodedToken = jwt.verify(token as string, config.security.keys.ACCESS_TOKEN_SIGN_KEY as string) as DecodedAccessToken;
        if (!token || !decodedToken.id) {
            throw new InvalidCredentials();
        }
        // store decoded token in request object
        Object.defineProperty(req, config.accessToken.name, { value: decodedToken, writable: false });
        next();
    }
    catch(error) {
        return next(error);
    }
}

const isUserLoggedIn = async (request: Request, _response: Response, next: NextFunction) => {
    // logged in user should currently have a refresh token stored in db
    const { id } = extractAccessToken(request);
    const loggedIn = await RefreshToken.findOne({ userId: id });
    if(!loggedIn) {
        return next(new JsonWebTokenError('invalid refresh token'));
    }
    next();
};

async function _verifyRefreshToken(request: Request, _response: Response, next: NextFunction) {
    // refresh token verification will not be run for certain path/method combinations
    if(preventExecution(verifyRefreshToken.name, request.method as RequestMethod, request.path)) return next();
    
    try {
        // refresh token is sent as a cookie
        const refreshToken = request.cookies[config.refreshToken.cookie.name] as IRefreshToken;
        // lookup in DB
        const retrieved = await RefreshToken.findOne({ token: refreshToken.token });
        if(!retrieved || retrieved.userId !== refreshToken.userId) {
            return next(new JsonWebTokenError('invalid refresh token'));
        }
        console.log('verify refresh token for user id', retrieved.userId);
        // check refresh token is still alive (trust token from db)
        if(new Date(retrieved.expires) < new Date()) {
            // remove expired token from DB
            await authServices.revokeRefreshToken(retrieved.token);
            throw new TokenExpiredError('refresh token expired', new Date(request.cookies[config.refreshToken.cookie.name].expires*1000));
        }
        // verify against sign key
        jwt.verify(refreshToken.token, config.security.keys.REFRESH_TOKEN_SIGN_KEY as string);
        console.log('refresh token is valid');
        next();
    }
    catch(error: any) {
        console.log('refresh token is invalid');
        console.log(error.message);
        return next(error);
    }
}

function verifyRefreshToken(req: Request, res: Response, next: NextFunction) {
    asyncHandler(_verifyRefreshToken)(req, res, next);
}

export {
    decodeAccessToken,
    verifyRefreshToken,
    isUserLoggedIn
};
