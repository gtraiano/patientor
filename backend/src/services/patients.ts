import { Patient, PublicPatient, NewPatient, Entry, NewEntry } from '../types';
import Validation from '../utils/validation';
import PatientModel from '../models/Patient';

const getPatients = async (): Promise<Array<PublicPatient>> => {
    return (await PatientModel.find({})).map(p => p.toPublicPatient());
}

const findById = async (id: string): Promise<Patient | undefined | null> => {
    return (await PatientModel.findById(id))?.toJSON();
}

const addPatient = async (patient: NewPatient): Promise<Patient> => {
    const created = await PatientModel.create(patient);
    return created.toJSON();
}

const removePatient = async (id: string): Promise<void> => {
    await PatientModel.findByIdAndRemove(id);
    //return (await PatientModel.find({})).map(p => p.toJSON());
}

const editPatient = async (id: string, data: any): Promise<Patient> => {
    const validated = Validation.parseEditPatient(data);
    const ssnExists = await PatientModel.findOne({ ssn: data.ssn });
    if(ssnExists && ssnExists._id.toString() !== id) { // ssn exists and belongs to another patient
        throw new Error('Validation failed: ssn already exists');
    }
    const patient = await PatientModel.findOneAndUpdate({ _id: id }, validated, { new: true });
    if(!patient) {
        throw new Error(`Patient id ${id} does not exist`);
    }
    return patient;
}

const addEntry = async (patientdId: string, entry: NewEntry): Promise<Patient | undefined> => {
    const newEntry: Entry = Validation.parseEntry(entry);
    const patient = await PatientModel.findById(patientdId);
    if(!patient) {
        throw new Error('Patient id does not exist');
    }
    patient.entries.push(newEntry);
    await patient.save();
    return patient;
}

const editEntry = async (patientId: string, entryId: string, entry: Entry, method: string): Promise<Patient> => {
    if(!['PUT', 'PATCH'].includes(method.toUpperCase())) {
        throw new Error(`${method} is an invalid value for argument 'method'`);
    }

    let patient = await PatientModel.findOne({ _id: patientId });
    if(!patient) {
        throw new Error('Patient id does not exist');
    }

    let toEdit = patient.entries.findIndex(e => e.id === entryId);
    if(toEdit === -1) {
        throw new Error('Entry id does not exist');
    }

    patient.entries[toEdit] = {
        ...patient.toObject().entries[toEdit],
        ...Object.fromEntries(
            Object.entries(
                method === 'PUT'
                    ? Validation.parseEntry(entry)
                    : entry
            )
            .filter(([key,]) => key !== 'id') // remove id property to prevent changing via request
        ),
        id: patient.toObject().entries[toEdit].id
    };

    await patient.save();
    return patient.toJSON();
}

const removeEntry = async (patientdId:string, entryId: string): Promise<Patient> => {
    let patient = await PatientModel.findById(patientdId);
    if(!patient) {
        throw new Error('Patient id does not exist');
    }
    patient.entries = patient?.entries.filter(entry => entry.id !== entryId);
    await patient.save();
    return patient.toJSON();
}

const toNewPatient = (patient: any): NewPatient => {
    const newPatient: NewPatient = {
        name: Validation.parseName(patient.name),
        ssn: Validation.parseString(patient.ssn, 'ssn' ,Validation.patterns.ssnPattern),
        dateOfBirth: Validation.parseDate(patient.dateOfBirth),
        gender: Validation.parseGender(patient.gender),
        occupation: Validation.isString(patient.occupation) && patient.occupation
    };
    return newPatient;
}

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