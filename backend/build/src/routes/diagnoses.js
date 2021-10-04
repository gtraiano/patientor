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
const diagnoses_1 = __importDefault(require("../services/diagnoses"));
const diagnosesRouter = (0, express_1.Router)();
diagnosesRouter.get('/', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(yield diagnoses_1.default.getDiagnoses());
}));
diagnosesRouter.get('/:code', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const diagnosis = yield diagnoses_1.default.findByCode(req.params.code);
    return diagnosis ? res.json(diagnosis) : res.sendStatus(404);
}));
diagnosesRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const diagnosis = yield diagnoses_1.default.addDiagnosis(req.body);
        res.json(diagnosis);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
diagnosesRouter.put('/:code', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const diagnosis = yield diagnoses_1.default.editDiagnosis(req.body);
        res.json(diagnosis);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
diagnosesRouter.delete('/:code', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield diagnoses_1.default.removeDiagnosis(req.params.code);
        res.sendStatus(200);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
exports.default = diagnosesRouter;
