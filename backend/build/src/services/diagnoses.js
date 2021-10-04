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
const validation_1 = __importDefault(require("../utils/validation"));
const Diagnosis_1 = __importDefault(require("../models/Diagnosis"));
const getDiagnoses = () => __awaiter(void 0, void 0, void 0, function* () {
    const diag = yield Diagnosis_1.default.find({});
    return diag.map(d => d.toJSON());
});
const addDiagnosis = (diagnosis) => __awaiter(void 0, void 0, void 0, function* () {
    const newDiagnosis = validation_1.default.parseDiagnosis(diagnosis);
    const diag = yield Diagnosis_1.default.create(newDiagnosis);
    return diag.toJSON();
    //return newDiagnosis;
});
const editDiagnosis = (diagnosis) => __awaiter(void 0, void 0, void 0, function* () {
    const edited = yield Diagnosis_1.default.findOneAndUpdate({ code: diagnosis.code }, diagnosis);
    if (!edited) {
        throw new Error(`Diagnosis code ${diagnosis.code} does not exist`);
    }
    return edited /*.toJSON()*/;
});
const removeDiagnosis = (code) => __awaiter(void 0, void 0, void 0, function* () {
    const deleted = yield Diagnosis_1.default.findOneAndDelete({ code: code });
    if (!deleted) {
        throw new Error(`Diagnosis code ${code} does not exist`);
    }
    return deleted.toJSON();
});
const findByCode = (code) => __awaiter(void 0, void 0, void 0, function* () {
    const diagnosis = yield Diagnosis_1.default.findOne({ code: code });
    return diagnosis === null || diagnosis === void 0 ? void 0 : diagnosis.toJSON();
});
exports.default = {
    getDiagnoses,
    addDiagnosis,
    editDiagnosis,
    removeDiagnosis,
    findByCode
};
