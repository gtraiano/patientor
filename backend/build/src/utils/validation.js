"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
const isString = (str) => {
    return typeof str === 'string' || str instanceof String;
};
const isDate = (date) => {
    return !Number.isNaN(Date.parse(date));
};
const matchesPattern = (str, pattern) => {
    return pattern.test(str);
};
const isValidGender = (gender) => {
    //return Object.keys(Gender).includes(gender);
    return Object.values(types_1.Gender).includes(gender);
};
const isNumber = (value) => {
    return typeof value === 'number' || value instanceof Number;
};
const ssnPattern = /^[\da-zA-Z]+-[\da-zA-Z]+$/;
const datePattern = /^\d{2,4}-\d{1,2}-\d{1,2}$/;
const parseDate = (date) => {
    if (!date || !isString(date) || !isDate(date) || !matchesPattern(date, datePattern) || isNaN(Date.parse(date))) {
        throw new Error('Incorrect or missing date: ' + date);
    }
    return date;
};
const parseGender = (gender) => {
    if (!gender || !isString(gender) || !isValidGender(gender)) {
        throw new Error('Incorrect or missing gender: ' + gender);
    }
    return gender;
};
const parseName = (name) => {
    if (!name || !isString(name)) {
        throw new Error('Incorrect or missing name: ' + name);
    }
    return name;
};
const parseString = (text, paramName, pattern) => {
    if (!text || !isString(text) || !matchesPattern(text, pattern)) {
        throw new Error('Incorrect or missing parameter: ' + paramName);
    }
    return text;
};
const isValidBaseEntry = (entry) => {
    if (!entry.description || !isString(entry.description)) {
        throw new Error('Incorrect or missing description');
    }
    if (!entry.date || !parseDate(entry.date)) {
        throw new Error('Incorrect or missing date');
    }
    if (!entry.specialist || !isString(entry.specialist)) {
        throw new Error('Incorrect or missing date');
    }
    if (!entry.type || !isString(entry.type) || !Object.values(types_1.EntryType).includes(entry.type)) {
        throw new Error('Incorrect or missing entry type');
    }
    if (entry.diagnosisCodes) {
        if (!(entry.diagnosisCodes instanceof Array)) {
            throw new Error('Incorrect diagnosis entries');
        }
        entry.diagnosisCodes.forEach(de => {
            if (!isString(de)) {
                throw new Error('Incorrect diagnosis type');
            }
        });
    }
    return true;
};
const parseHealthCheckEntry = (entry) => {
    isValidBaseEntry(entry);
    if (entry.healthCheckRating === undefined || !isNumber(entry.healthCheckRating) ||
        !Object.values(types_1.HealthCheckRating).filter(n => !isNaN(Number(n))).includes(entry.healthCheckRating)) {
        throw new Error('Incorrect or missing health check rating');
    }
    return entry;
};
const parseHospitalEntry = (entry) => {
    isValidBaseEntry(entry);
    if (!entry.discharge) {
        throw new Error('Incorrect or missing health check rating');
    }
    if (!entry.discharge.criteria || !isString(entry.discharge.criteria)) {
        throw new Error('Incorrect or missing discharge criteria');
    }
    if (!entry.discharge.date || !parseDate(entry.discharge.date)) {
        throw new Error('Incorrect or missing discharge date');
    }
    return entry;
};
const parseOccupationalHealthcareEntry = (entry) => {
    isValidBaseEntry(entry);
    if (!entry.employerName || !isString(entry.employerName)) {
        throw new Error('Incorrect or missing employer name');
    }
    if (!entry.specialist || !isString(entry.specialist)) {
        throw new Error('Incorrect or missing specialist name');
    }
    if (entry.sickLeave) {
        if (!entry.sickLeave.startDate || !parseDate(entry.sickLeave.startDate)) {
            throw new Error('Incorrect or missing sick leave start date');
        }
        if (!entry.sickLeave.endDate || !parseDate(entry.sickLeave.endDate)) {
            throw new Error('Incorrect or missing sick leave end date');
        }
    }
    return entry;
};
const parseEntry = (entry) => {
    switch (entry.type) {
        case types_1.EntryType.HealthCheck:
            return parseHealthCheckEntry(entry);
        case types_1.EntryType.Hospital:
            return parseHospitalEntry(entry);
        case types_1.EntryType.OccupationalHealthcare:
            return parseOccupationalHealthcareEntry(entry);
        default:
            throw new Error('Invalid or missing entry type');
    }
};
const parseDiagnosis = (entry) => {
    Object.keys(entry).forEach(k => {
        if (!entry[k] && k !== 'latin')
            throw new Error(`Diagnosis ${k} is missing`);
    });
    return entry;
};
const parseEditPatient = (entry) => {
    if (entry.id !== undefined) {
        throw new Error('id cannot be edited');
    }
    if (entry.entries !== undefined) {
        throw new Error('Entries cannot be edited');
    }
    parseName(entry.name);
    if (!matchesPattern(entry.ssn, ssnPattern)) {
        throw new Error('Invalid ssn');
    }
    parseDate(entry.dateOfBirth);
    parseGender(entry.gender);
    if (!isString(entry.occupation)) {
        throw new Error('occupation must be a string');
    }
    return entry;
};
const Validation = {
    isString,
    isDate,
    matchesPattern,
    isValidGender,
    parseDate,
    parseGender,
    parseName,
    parseString,
    parseEntry,
    parseDiagnosis,
    parseEditPatient,
    patterns: {
        datePattern,
        ssnPattern
    }
};
exports.default = Validation;
