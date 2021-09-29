import mongoose, { Schema, Document } from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import { Patient, Gender, PublicPatient } from '../types';
import { EntrySchema } from './Entry';

export interface PatientDoc extends Patient, Document {
    id: string,
    toPublicPatient: () => PublicPatient
};

const PatientSchema = new Schema<PatientDoc>({
    name: {
        type: String,
        required: true
    },
    ssn: {
        type: String,
        required: true,
        unique: true
    },
    dateOfBirth: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: {
            values: Object.values(Gender),
            message: '{VALUE} is not supported'
        }
    },
    occupation: {
        type: String,
        required: true
    },
    entries: {
        type: [EntrySchema],
        required: true,
        default: []
    }
});

PatientSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
    }
});

PatientSchema.method('toPublicPatient', function (): PublicPatient {
    return {
        id: this._id.toString(),
        name: this.name,
        dateOfBirth: this.dateOfBirth,
        gender: this.gender,
        occupation: this.occupation
    };
});

PatientSchema.plugin(mongooseUniqueValidator);

export default mongoose.model<PatientDoc>('Patient', PatientSchema, 'Patients');