import { Patient, PublicPatient, NewPatient, Entry, NewEntry, EntryType } from '../types';
import Validation from '../utils/validation';
import PatientModel from '../models/Patient';
import { HealthCheckEntry, HospitalEntry, OccupationalHealthcareEntry } from '../models/Entry';
import { HospitalEntryDoc } from '../models/Entry/HospitalEntry';
import { HealthCheckEntryDoc } from '../models/Entry/HealthCheckEntry';
import { OccupationalHealthcareEntryDoc } from '../models/Entry/OccupationalHealthcareEntry';
import { Schema } from 'mongoose';

const getPatients = async (): Promise<Array<PublicPatient>> => {
    const patients = await PatientModel.find({});
    return await Promise.all(patients.map(async p => await p.toPublicPatient()));
};

const findById = async (id: string): Promise<Patient | undefined | null> => {
    return (await PatientModel.findById(id).populate('entries'))?.toJSON();
};

const addPatient = async (patient: NewPatient): Promise<Patient> => {
    const newPatient = new PatientModel(patient);
    const created = await newPatient.save();
    return created.toJSON();
};

const removePatient = async (id: string): Promise<void> => {
    await PatientModel.findByIdAndRemove(id);
};

const editPatient = async (id: string, data: unknown): Promise<Patient> => {
    const validated = Validation.parseEditPatient(data);
    /*const ssnExists = await PatientModel.findOne({ ssn: data.ssn });
    if(ssnExists && ssnExists._id.toString() !== id) { // ssn exists and belongs to another patient
        throw new Error('Validation failed: ssn already exists');
    }*/
    const patient = await PatientModel.findOneAndUpdate({ _id: id }, validated, { new: true, runValidators: true });
    if(!patient) {
        throw new Error(`Patient id ${id} does not exist`);
    }
    return patient;
};

const addEntry = async (patientdId: string, entry: NewEntry): Promise<Patient | undefined> => {
    const newEntry: Entry = Validation.parseEntry(entry);
    const patient = await PatientModel.findById(patientdId);
    if(!patient) {
        throw new Error('Patient id does not exist');
    }
    
    let toSave: HospitalEntryDoc | HealthCheckEntryDoc | OccupationalHealthcareEntryDoc;
    switch(newEntry.type) {
        case EntryType.HealthCheck:
            toSave = new HealthCheckEntry(newEntry);
            break;
        case EntryType.Hospital:
            toSave = new HospitalEntry(newEntry);
            break;
        case EntryType.OccupationalHealthcare:
            toSave = new OccupationalHealthcareEntry(newEntry);
            break;
        default:
            throw Error(`Entry type must be [${Object.values(EntryType).join(', ')}]`);
    }
    toSave.patientId = patient._id as Schema.Types.ObjectId;
    await toSave.save();
    
    return patient;
};

const editEntry = async (patientId: string, entryId: string, entry: Entry, method: string): Promise<Patient> => {
    if(!['PUT', 'PATCH'].includes(method.toUpperCase())) {
        throw new Error(`${method} is an invalid value for argument 'method'`);
    }

    const patient = await PatientModel.findOne({ _id: patientId });
    if(!patient) {
        throw new Error('Patient id does not exist');
    }

    const toEdit = patient.entries.findIndex(e => e.id === entryId);
    if(toEdit === -1) {
        throw new Error('Entry id does not exist');
    }

    patient.entries[toEdit] = {
        ...patient.toObject().entries[toEdit],
        ...Object.fromEntries(
            Object.entries(
                method === 'PUT'
                    ? Validation.parseEntry(entry)
                    : entry // partial object
            )
            .filter(([key,]) => !['key', 'type'].includes(key)) // remove id and type property to prevent changing via request
        ),
        id: patient.toObject().entries[toEdit].id
    };

    await patient.save({ validateBeforeSave: false });
    return patient.toJSON();
};

const removeEntry = async (patientdId:string, entryId: string): Promise<Patient> => {
    const patient = await PatientModel.findById(patientdId);
    if(!patient) {
        throw new Error('Patient id does not exist');
    }
    patient.entries = patient?.entries.filter(entry => entry.id !== entryId);
    await patient.save({ validateBeforeSave: false });
    return patient.toJSON();
};

const toNewPatient = (patient: unknown): NewPatient => {
    const newPatient: NewPatient = {
        name: Validation.parseName((patient as NewPatient).name),
        ssn: Validation.parseString((patient as NewPatient).ssn, 'ssn' ,Validation.patterns.ssnPattern),
        dateOfBirth: Validation.parseDate((patient as NewPatient).dateOfBirth),
        gender: Validation.parseGender((patient as NewPatient).gender),
        occupation: Validation.isString((patient as NewPatient).occupation) ? (patient as NewPatient).occupation : ''
    };
    return newPatient;
};

export default {
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