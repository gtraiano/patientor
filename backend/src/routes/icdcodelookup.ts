/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import { AxiosError } from "axios";
import ICDCService from '../services/icdcodelookup';

const ICDCLookupRouter: Router = Router();

ICDCLookupRouter.post('/', async (req, res) => {
    try {
        if(!Object.keys(req.body).includes('terms')) {
            throw new Error('Parameter "terms" is missing');
        }
        const data = await ICDCService.searchTerms(req.body.terms);
        res.json(data);
    }
    catch(error: any | AxiosError) {
        res.status((error as AxiosError).isAxiosError ? error.response?.status || 400 : 400).json({ error: (error as Error).message });
    }
});

export default ICDCLookupRouter;