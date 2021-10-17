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
const types_1 = require("../types");
const validation_1 = __importDefault(require("../utils/validation"));
const Patient_1 = __importDefault(require("../models/Patient"));
const Entry_1 = require("../models/Entry");
const getPatients = () => __awaiter(void 0, void 0, void 0, function* () {
    return (yield Patient_1.default.find({})).map(p => p.toPublicPatient());
});
const findById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    return (_a = (yield Patient_1.default.findById(id))) === null || _a === void 0 ? void 0 : _a.toJSON();
});
const addPatient = (patient) => __awaiter(void 0, void 0, void 0, function* () {
    const newPatient = new Patient_1.default(patient);
    const created = yield newPatient.save();
    return created.toJSON();
});
const removePatient = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield Patient_1.default.findByIdAndRemove(id);
});
const editPatient = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const validated = validation_1.default.parseEditPatient(data);
    const ssnExists = yield Patient_1.default.findOne({ ssn: data.ssn });
    if (ssnExists && ssnExists._id.toString() !== id) { // ssn exists and belongs to another patient
        throw new Error('Validation failed: ssn already exists');
    }
    const patient = yield Patient_1.default.findOneAndUpdate({ _id: id }, validated, { new: true });
    if (!patient) {
        throw new Error(`Patient id ${id} does not exist`);
    }
    return patient;
});
const addEntry = (patientdId, entry) => __awaiter(void 0, void 0, void 0, function* () {
    const newEntry = validation_1.default.parseEntry(entry);
    const patient = yield Patient_1.default.findById(patientdId);
    if (!patient) {
        throw new Error('Patient id does not exist');
    }
    switch (newEntry.type) {
        case types_1.EntryType.HealthCheck:
            patient.entries.push(new Entry_1.HealthCheckEntry(newEntry));
            break;
        case types_1.EntryType.Hospital:
            patient.entries.push(new Entry_1.HospitalEntry(newEntry));
            break;
        case types_1.EntryType.OccupationalHealthcare:
            patient.entries.push(new Entry_1.OccupationalHealthcareEntry(newEntry));
            break;
        default:
            throw Error(`Entry type must be [${Object.values(types_1.EntryType).join(', ')}]`);
    }
    yield patient.save({ validateBeforeSave: false });
    return patient;
});
const editEntry = (patientId, entryId, entry, method) => __awaiter(void 0, void 0, void 0, function* () {
    if (!['PUT', 'PATCH'].includes(method.toUpperCase())) {
        throw new Error(`${method} is an invalid value for argument 'method'`);
    }
    let patient = yield Patient_1.default.findOne({ _id: patientId });
    if (!patient) {
        throw new Error('Patient id does not exist');
    }
    let toEdit = patient.entries.findIndex(e => e.id === entryId);
    if (toEdit === -1) {
        throw new Error('Entry id does not exist');
    }
    patient.entries[toEdit] = Object.assign(Object.assign(Object.assign({}, patient.toObject().entries[toEdit]), Object.fromEntries(Object.entries(method === 'PUT'
        ? validation_1.default.parseEntry(entry)
        : entry // partial object
    )
        .filter(([key,]) => !['key', 'type'].includes(key)) // remove id and type property to prevent changing via request
    )), { id: patient.toObject().entries[toEdit].id });
    yield patient.save({ validateBeforeSave: false });
    return patient.toJSON();
});
const removeEntry = (patientdId, entryId) => __awaiter(void 0, void 0, void 0, function* () {
    let patient = yield Patient_1.default.findById(patientdId);
    if (!patient) {
        throw new Error('Patient id does not exist');
    }
    patient.entries = patient === null || patient === void 0 ? void 0 : patient.entries.filter(entry => entry.id !== entryId);
    yield patient.save();
    return patient.toJSON();
});
const toNewPatient = (patient) => {
    const newPatient = {
        name: validation_1.default.parseName(patient.name),
        ssn: validation_1.default.parseString(patient.ssn, 'ssn', validation_1.default.patterns.ssnPattern),
        dateOfBirth: validation_1.default.parseDate(patient.dateOfBirth),
        gender: validation_1.default.parseGender(patient.gender),
        occupation: validation_1.default.isString(patient.occupation) && patient.occupation
    };
    return newPatient;
};
exports.default = {
    getPatients,
    addPatient,
    removePatient,
    editPatient,
    removeEntry,
    findById,
    toNewPatient,
    addEntry,
    editEntry
};
