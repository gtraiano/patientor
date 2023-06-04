import { NextFunction, Request, Response } from "express";
import { Error as MongooseError } from 'mongoose';

export class CustomError extends Error {
    code?: number;
    constructor(message: string, code?: number, name?: string) {
        super(message);
        Object.setPrototypeOf(this, CustomError.prototype);
        this.name = name || "CustomError";
        code !== undefined && (this.code = code);
    }
}

const authErrorHandler = (error: any, _request: Request, response: Response, next: NextFunction) => {
    if (error.name === 'CastError') {
        return response.status(400).json({ error: 'malformatted id' || error.message });
    }
    else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: (error as Error).message });
    }
    else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: 'invalid token' });
    }
    else if (error.name === 'TokenExpiredError') {
        return response.status(401).json({ error: (error as Error).message || 'token expired' });
    }
    else if (error.name === 'InvalidCredentials') {
        return response.status(401).json({ error: (error as Error).message });
    }
    return next(error);
};

const dbErrorHandler = (error: MongooseError | any, _request: Request, response: Response, next: NextFunction) => {
    if(error instanceof MongooseError) return response.status(400).json({ error: error.message });
    return next(error);
};

const generalErrorHandler = (error: any | CustomError, _request: Request, response: Response, _next: NextFunction) => {
    if(error instanceof CustomError) return response.status(error?.code || 500).json({ error: error.message });
    return response.status(500).json({ error: (error as Error).message });
};

export default {
    auth: {
        authErrorHandler
    },
    db: {
        dbErrorHandler
    },
    general: {
        generalErrorHandler
    }
};