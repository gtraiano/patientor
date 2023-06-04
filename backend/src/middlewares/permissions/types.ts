import { Request } from "express";

export type RequestMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | '*';
// asterisk serves as a wildcard or as the remaining methods for which rules have not been set

export interface MethodRule {
    params: boolean,
    //allow: (roles: UserRole[], sourceId: string, targetId?: string, req?: Request) => boolean | Promise<boolean>,
    allow?: ((req: Request, sourceId: string, targetId?: string) => Promise<boolean> | boolean) | boolean
}

export type RouteRule = {
    [method in RequestMethod as string]?: MethodRule[]
};