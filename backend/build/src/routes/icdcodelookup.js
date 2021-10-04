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
const icdcodelookup_1 = __importDefault(require("../services/icdcodelookup"));
const ICDCLookupRouter = (0, express_1.Router)();
ICDCLookupRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!Object.keys(req.body).includes('terms')) {
            throw new Error('Parameter "terms" is missing');
        }
        const data = yield icdcodelookup_1.default.searchTerms(req.body.terms);
        res.json(data);
    }
    catch (error) {
        res.status(error.isAxiosError ? ((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) || 400 : 400).json({ error: error.message });
    }
}));
exports.default = ICDCLookupRouter;
