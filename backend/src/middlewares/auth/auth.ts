import { NextFunction, Request, Response } from 'express';
import jwt, { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import RefreshToken from '../../models/RefreshToken';
import authServices, { InvalidCredentials } from '../../services/auth';
import config from '../../config';
import { DecodedAccessToken } from '../../types';
import { preventExecution, RequestMethod } from './rules';


const getAccessToken = (request: Request): string | null => {
    // extract authorization token
    const authorization = request.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7);
    }
    return null;
};

function decodeAccessToken(req: Request, _res: Response, next: NextFunction) {
    if(preventExecution(decodeAccessToken.name, req.method as RequestMethod, req.path)) return next();
    try {
        const token = getAccessToken(req);
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const loggedIn = await RefreshToken.findOne({ userId: (request as any)[config.accessToken.name].id });
    if(!loggedIn) {
        return next(new JsonWebTokenError('invalid token'));
    }
    next();
};

async function verifyRefreshToken(request: Request, _response: Response, next: NextFunction) {
    if(preventExecution(verifyRefreshToken.name, request.method as RequestMethod, request.path)) return next();
    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const refreshToken = request.cookies[config.refreshToken.cookie.name];
        // lookup in DB
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        jwt.verify(refreshToken.token, config.security.keys.REFRESH_TOKEN_SIGN_KEY as string);
        
        console.log('refresh token is valid');
        next();
        //return next();
    }
    catch(error: any) {
        console.log('refresh token is invalid');
        console.log(error.message);
        return next(error);
    }
}

export {
    decodeAccessToken,
    verifyRefreshToken,
    isUserLoggedIn
};
