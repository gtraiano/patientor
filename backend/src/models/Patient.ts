import mongoose, { Schema, Document } from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import { Patient, Gender, PublicPatient, EntryType, Entry, HealthCheckRating } from '../types';
import { BaseEntrySchema } from './Entry/BaseEntry';

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
        type: [BaseEntrySchema],
        required: true,
        default: []
    }
});

const healthRating = (entries: Entry[]): HealthCheckRating => {
    const healthCheck = entries.filter((e: Entry) => e.type === EntryType.HealthCheck).map((e: any) => e._doc.healthCheckRating);
    if(!healthCheck || !healthCheck.length) return HealthCheckRating.Undetermined;
    return Math.round(healthCheck.reduce((acc: number, cur: number) => acc + cur, 0) / healthCheck.length) as HealthCheckRating;
};

PatientSchema.virtual('healthRating').get(function(this: PatientDoc): number {
    return healthRating(this.entries);
});

PatientSchema.set('toJSON', {
    virtuals: true,
    transform: (_document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
    }
});

PatientSchema.set('toObject', { virtuals: true });

PatientSchema.method('toPublicPatient', function (this: PatientDoc): PublicPatient {
    return {
        id: this._id.toString(),
        name: this.name,
        dateOfBirth: this.dateOfBirth,
        gender: this.gender,
        occupation: this.occupation,
        healthRating: healthRating(this.entries)
    };
});

PatientSchema.plugin(mongooseUniqueValidator);

export default mongoose.model<PatientDoc>('Patient', PatientSchema, 'Patients');