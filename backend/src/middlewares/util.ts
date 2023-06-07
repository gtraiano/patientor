import Layer, { Request, Response, NextFunction } from "express";

// https://stackoverflow.com/questions/61086833/async-await-in-express-middleware
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
};

// check if all middlewares in names are included in app stack
// https://stackoverflow.com/questions/26304234/check-if-a-given-middleware-is-being-used
export const isMiddlewareInUse = (req: Request, names: string[]): boolean => {
    const stack = req.app._router.stack as Array<typeof Layer> ?? [];
    //return stack.map(({ name }) => name).filter(n => names.includes(n)).length === names.length;
    return stack.reduce<boolean>((all, { name }) => all || names.includes(name), false);
};

// removes middleware by name from app stack
export const unloadMiddleware = (req: Request, name: string) => {
    const stack = req.app._router.stack as Array<typeof Layer> ?? [];
    const idx = stack.findIndex(m => m.name === name);
    idx !== -1 && stack.splice(idx, 1);
};