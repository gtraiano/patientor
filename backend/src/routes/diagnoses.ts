import { Router } from "express";
import diagnosesService from '../services/diagnoses';

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
        res.status(400).json({ error: error.message });
    }
})

diagnosesRouter.put('/:code', async (req, res) => {
    try {
        const diagnosis = await diagnosesService.editDiagnosis(req.body);
        res.json(diagnosis);
    }
    catch(error: any) {
        res.status(400).json({ error: error.message })
    }
});

diagnosesRouter.delete('/:code', async (req, res) => {
    try {
        await diagnosesService.removeDiagnosis(req.params.code);
        res.sendStatus(200);
    }
    catch(error: any) {
        res.status(400).json({ error: error.message })
    }
})

export default diagnosesRouter;