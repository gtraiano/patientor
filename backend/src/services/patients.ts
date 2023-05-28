import { Patient, PublicPatient, NewPatient, Entry, NewEntry, EntryType } from '../types';
import Validation from '../utils/validation';
import PatientModel from '../models/Patient';
import { HealthCheckEntry, HospitalEntry, OccupationalHealthcareEntry } from '../models/Entry';
import { HospitalEntryDoc } from '../models/Entry/HospitalEntry';
import { HealthCheckEntryDoc } from '../models/Entry/HealthCheckEntry';
import { OccupationalHealthcareEntryDoc } from '../models/Entry/OccupationalHealthcareEntry';
import { Schema } from 'mongoose';
import BaseEntry from '../models/Entry/BaseEntry';

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
    const patient = await PatientModel.findOneAndUpdate({ _id: id }, validated, { new: true, runValidators: true });
    if(!patient) {
        throw new Error(`Patient id ${id} does not exist`);
    }
    return patient;
};

const addEntry = async (authorId: string, patientdId: string, entry: NewEntry): Promise<Patient | undefined> => {
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
    toSave.authorId =  authorId as unknown as Schema.Types.ObjectId;
    await toSave.save();
    
    return patient.toJSON();
};

const editEntry = async (authorId: string, patientId: string, entryId: string, entry: Entry): Promise<Patient> => {
    const patient = await PatientModel.findOne({ _id: patientId });
    if(!patient) {
        throw new Error('Patient id does not exist');
    }

    const edited = await BaseEntry.replaceOne(
        { _id: entryId },
        { ...entry, authorId, patientId },
        { overwriteDiscriminatorKey: true, runValidators: true, upsert: false }
    );
    if(!edited.modifiedCount) throw new Error('Entry id does not exist');

    return patient.toJSON();
};

const removeEntry = async (patientdId: string, entryId: string): Promise<Patient> => {
    const patient = await PatientModel.findById(patientdId);
    if(!patient) {
        throw new Error('Patient id does not exist');
    }
    const deleted = await BaseEntry.deleteOne({ _id: entryId });
    if(deleted.deletedCount === 0) throw new Error('Entry id does not exist');
    return patient.toJSON();
};

const toNewPatient = (patient: unknown): NewPatient => {
    const newPatient: NewPatient = {
        name: Validation.parseName((patient as NewPatient).name),
        ssn: Validation.parseString((patient as NewPatient).ssn, 'ssn', Validation.patterns.ssnPattern),
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