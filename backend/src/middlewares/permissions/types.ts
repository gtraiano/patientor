import { Request } from "express";

export type RequestMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | '*';
// asterisk serves as a wildcard or as the remaining methods for which rules have not been set

export interface MethodRule {
    params: boolean,                                                    // path url has parameters (e.g. /path/123/subpath/456)
    allow?: ((req: Request, primaryId: string, secondaryId?: string)    // allow operation 
                                                                        // primaryId = primary entity id, secondaryId = secondary entity id (e.g. /patients/primaryId/entries/secondaryId)
        => Promise<boolean> | boolean) | boolean                        // may be boolean, function or promise returning boolean
}

export type RouteRule = {                                               // rule for specific method
    [method in RequestMethod as string]?: MethodRule[]
};