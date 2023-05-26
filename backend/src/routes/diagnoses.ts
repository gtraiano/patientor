/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import diagnosesService from '../services/diagnoses';
import { Diagnosis } from "../types";

const diagnosesRouter: Router = Router();

diagnosesRouter.get('/', async (_req, res) => {
    res.json(await diagnosesService.getDiagnoses());
});

diagnosesRouter.get('/:code', async (req, res) => {
    const diagnosis = await diagnosesService.findByCode(req.params.code);
    return diagnosis ? res.json(diagnosis) : res.sendStatus(404);
});

diagnosesRouter.post('/', async (req, res) => {
    try {
        const diagnosis = await diagnosesService.addDiagnosis(req.body);
        res.json(diagnosis);
    }
    catch(error: any) {
        res.status(400).json({ error: (error as Error).message });
    }
});

diagnosesRouter.put('/:code', async (req, res) => {
    try {
        const diagnosis = await diagnosesService.editDiagnosis(req.body as Diagnosis);
        res.json(diagnosis);
    }
    catch(error: any) {
        res.status(400).json({ error: (error as Error).message });
    }
});

diagnosesRouter.delete('/:code', async (req, res) => {
    try {
        await diagnosesService.removeDiagnosis(req.params.code);
        res.sendStatus(200);
    }
    catch(error: any) {
        res.status(400).json({ error: (error as Error).message });
    }
});

export default diagnosesRouter;