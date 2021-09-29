import { Gender, NewEntry, EntryType, HealthCheckEntry, HealthCheckRating, HospitalEntry, OccupationalHealthcareEntry, Diagnosis, PatientFormValues } from "../types";

const isString = (str: unknown): boolean => {
    return typeof str === 'string' || str instanceof String;
};

const isDate = (date: string): boolean => {
    return !Number.isNaN(Date.parse(date));
};

const matchesPattern = (str: string, pattern: RegExp): boolean => {
    return pattern.test(str);
};

const isValidGender = (gender: string): boolean => {
    //return Object.keys(Gender).includes(gender);
    return Object.values(Gender).includes(gender as Gender);
};

const isNumber = (value: unknown) => {
    return typeof value === 'number' || value instanceof Number;
}

const ssnPattern = /^[\da-zA-Z]+-[\da-zA-Z]+$/;
const datePattern = /^\d{2,4}-\d{1,2}-\d{1,2}$/;

const parseDate = (date: unknown): string => {
    if (!date || !isString(date) || !isDate(date as string) || !matchesPattern(date as string, datePattern) || isNaN(Date.parse(date as string))) {
        throw new Error('Incorrect or missing date: ' + date);
    }
    return date as string;
};

const parseGender = (gender: string): Gender => {
    if(!gender || !isString(gender) || !isValidGender(gender)) {
        throw new Error('Incorrect or missing gender: ' + gender);
    }
    return gender as Gender;
}

const parseName = (name: unknown): string => {
    if(!name || !isString(name)) {
        throw new Error('Incorrect or missing name: ' + name);
    }
    return name as string;
}

const parseString = (text: unknown, paramName: string , pattern: RegExp): string => {
    if(!text || !isString(text) || !matchesPattern(text as string, pattern)) {
        throw new Error('Incorrect or missing parameter: ' + paramName);
    }
    return text as string;
}

const isValidBaseEntry = (entry: NewEntry): boolean => {
    if(!entry.description || !isString(entry.description)) {
        throw new Error('Incorrect or missing description');
    }

    if(!entry.date || !parseDate(entry.date)) {
        throw new Error('Incorrect or missing date');
    }

    if(!entry.specialist || !isString(entry.specialist)) {
        throw new Error('Incorrect or missing date');
    }

    if(!entry.type || !isString(entry.type) || !Object.values(EntryType).includes(entry.type as EntryType)) {
        throw new Error('Incorrect or missing entry type');
    }

    if(entry.diagnosisCodes) {
        if(!(entry.diagnosisCodes instanceof Array)) {
            throw new Error('Incorrect diagnosis entries');
        }
        entry.diagnosisCodes.forEach(de  => {
            if(!isString(de)) {
                throw new Error('Incorrect diagnosis type');
            }
        });
    }

    return true;
}

const parseHealthCheckEntry = (entry: HealthCheckEntry): HealthCheckEntry => {
    isValidBaseEntry(entry);
    if(
        entry.healthCheckRating === undefined || !isNumber(entry.healthCheckRating) ||
        !Object.values(HealthCheckRating).filter(n => !isNaN(Number(n))).includes(entry.healthCheckRating)
    ) {
        throw new Error('Incorrect or missing health check rating')
    }
    return entry;
}

const parseHospitalEntry = (entry: HospitalEntry): HospitalEntry => {
    isValidBaseEntry(entry);
    if(!entry.discharge) {
        throw new Error('Incorrect or missing health check rating')
    }
    if(!entry.discharge.criteria || !isString(entry.discharge.criteria)) {
        throw new Error('Incorrect or missing discharge criteria');
    }
    if(!entry.discharge.date || !parseDate(entry.discharge.date)) {
        throw new Error('Incorrect or missing discharge date');
    }
    return entry;
}

const parseOccupationalHealthcareEntry = (entry : OccupationalHealthcareEntry): OccupationalHealthcareEntry => {
    isValidBaseEntry(entry);
    if(!entry.employerName || !isString(entry.employerName)) {
        throw new Error('Incorrect or missing employer name');
    }
    if(!entry.specialist || !isString(entry.specialist)) {
        throw new Error('Incorrect or missing specialist name');
    }
    if(entry.sickLeave) {
        if(!entry.sickLeave.startDate || !parseDate(entry.sickLeave.startDate)) {
            throw new Error('Incorrect or missing sick leave start date');
        }
        if(!entry.sickLeave.endDate || !parseDate(entry.sickLeave.endDate)) {
            throw new Error('Incorrect or missing sick leave end date');
        }
    }
    return entry;
}

const parseEntry = (entry: NewEntry): HealthCheckEntry | HospitalEntry | OccupationalHealthcareEntry => {
    switch(entry.type) {
        case EntryType.HealthCheck:
            return parseHealthCheckEntry(entry as HealthCheckEntry);
        case EntryType.Hospital:
            return parseHospitalEntry(entry as HospitalEntry);
        case EntryType.OccupationalHealthcare:
            return parseOccupationalHealthcareEntry(entry as OccupationalHealthcareEntry);
        default:
            throw new Error('Invalid or missing entry type');
    }
}

const parseDiagnosis = (entry: any): Diagnosis => {
    Object.keys(entry).forEach(k => {
        if(!entry[k] && k !== 'latin')
            throw new Error(`Diagnosis ${k} is missing`);
    });
    return entry as Diagnosis;
}

const parseEditPatient = (entry: any): PatientFormValues => {
    if(entry.id !== undefined) {
        throw new Error('id cannot be edited');
    }
    if(entry.entries !== undefined) {
        throw new Error('Entries cannot be edited');
    }
    parseName(entry.name);
    if(!matchesPattern(entry.ssn, ssnPattern)) {
        throw new Error('Invalid ssn');
    }
    parseDate(entry.dateOfBirth);
    parseGender(entry.gender);
    if(!isString(entry.occupation)) {
        throw new Error('occupation must be a string');
    }
    return entry;
}

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

export default Validation;