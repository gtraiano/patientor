import { NextFunction, Request, Response } from "express";

const authErrorHandler = (error: any, _request: Request, response: Response, next: NextFunction) => {
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    }
    else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
    }
    else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: 'invalid token' });
    }
    else if (error.name === 'TokenExpiredError') {
        return response.status(401).json({ error: error.message || 'token expired' });
    }
    else if (error.name === 'InvalidCredentials') {
        return response.status(401).json({ error: error.message });
    }
    return next(error);
}

export default {
    auth: {
        authErrorHandler
    }
}