"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const patients_1 = __importDefault(require("../services/patients"));
const patientsRouter = (0, express_1.Router)();
patientsRouter.get('/', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(yield patients_1.default.getPatients());
}));
patientsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const found = yield patients_1.default.findById(req.params.id);
    found ? res.json(found) : res.status(404).end();
}));
patientsRouter.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const patient = yield patients_1.default.editPatient(req.params.id, req.body);
        res.json(patient);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
patientsRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield patients_1.default.removePatient(req.params.id);
        res.sendStatus(200);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
patientsRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newPatient = patients_1.default.toNewPatient(req.body);
        const patient = yield patients_1.default.addPatient(newPatient);
        res.json(patient);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
patientsRouter.post('/:id/entries', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const entry = req.body;
    try {
        res.json(yield patients_1.default.addEntry(req.params.id, entry));
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
patientsRouter.patch('/:id/entries/:entryId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const entry = yield patients_1.default.editEntry(req.params.id, req.params.entryId, req.body, req.method);
        res.json(entry);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
patientsRouter.delete('/:id/entries/:entryId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const entry = yield patients_1.default.removeEntry(req.params.id, req.params.entryId);
        res.json(entry);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
patientsRouter.put('/:id/entries/:entryId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const entry = yield patients_1.default.editEntry(req.params.id, req.params.entryId, req.body, req.method);
        res.json(entry);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
exports.default = patientsRouter;
