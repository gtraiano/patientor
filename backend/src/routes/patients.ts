/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import patientsService from '../services/patients';
import { Entry, NewEntry, NewPatient, Patient } from "../types";

const patientsRouter: Router = Router();

patientsRouter.get('/', async (_req, res) => {
    res.json(await patientsService.getPatients());
});

patientsRouter.get('/:id', async (req, res) => {
    try {
        const found = await patientsService.findById(req.params.id);
        found ? res.json(found) : res.status(404).end();
    }
    catch(error: any) {
        res.status(404).json({ error: error.name === 'CastError' ? 'patient id does not exist' : error.message });
    }
});

patientsRouter.put('/:id', async (req, res) => {
    try {
        const patient = await patientsService.editPatient(req.params.id, req.body);
        res.json(patient);
    }
    catch(error: any) {
        res.status(400).json({ error: error.message });
    }
});

patientsRouter.delete('/:id', async (req, res) => {
    try {
        await patientsService.removePatient(req.params.id);
        res.sendStatus(200);
    }
    catch(error: any) {
        res.status(400).json({ error: error.message });
    }
});

patientsRouter.post('/', async (req, res) => {
    try {
        const newPatient: NewPatient = patientsService.toNewPatient(req.body);
        const patient: Patient = await patientsService.addPatient(newPatient);
        res.json(patient);
    }
    catch(error: any) {
        res.status(400).json({ error: error.message });
    }
});

patientsRouter.post('/:id/entries', async (req, res) => {
    const entry = req.body;
    try {
        res.json(await patientsService.addEntry(req.params.id, entry as NewEntry));
    }
    catch(error: any) {
        res.status(400).json({ error: error.message });
    }
});

patientsRouter.patch('/:id/entries/:entryId', async (req, res) => {
    try {
        const entry = await patientsService.editEntry(req.params.id, req.params.entryId, req.body as Entry, req.method);
        res.json(entry);
    }
    catch(error: any) {
        res.status(400).json({ error: error.message });
    }
});

patientsRouter.delete('/:id/entries/:entryId', async (req, res) => {
    try {
        const entry = await patientsService.removeEntry(req.params.id, req.params.entryId);
        res.json(entry);
    }
    catch(error: any) {
        res.status(400).json({ error: error.message });
    }
});

patientsRouter.put('/:id/entries/:entryId', async (req, res) => {
    try {
        const entry = await patientsService.editEntry(req.params.id, req.params.entryId, req.body, req.method);
        res.json(entry);
    }
    catch(error: any) {
        res.status(400).json({ error: error.message });
    }
});

export default patientsRouter;