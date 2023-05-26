import mongoose, { Schema, Document } from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import { Patient, Gender, PublicPatient, EntryType, Entry, HealthCheckRating, HealthCheckEntry } from '../types';
import { BaseEntrySchema } from './Entry/BaseEntry';

export interface PatientDoc extends Patient, Document {
    id: string,
    toPublicPatient: () => Promise<PublicPatient>
}

const PatientSchema = new Schema<PatientDoc>(
    {
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
        }
    }
);

// implementing the one to many relationship via a virtual field
// patient is the "one" in this relationship
PatientSchema.virtual<typeof BaseEntrySchema[]>('entries', {
    ref: 'Entry',
    localField: '_id',
    foreignField: 'patientId',
});

const healthRating = (entries: Entry[]): HealthCheckRating => {
    if(!entries) return HealthCheckRating.Undetermined;
    const healthCheck = entries.filter((e: Entry) => e.type === EntryType.HealthCheck).map((e: Entry) => (e as HealthCheckEntry).healthCheckRating);
    if(!healthCheck || !healthCheck.length) return HealthCheckRating.Undetermined;
    return Math.round(healthCheck.reduce((acc: number, cur: number) => acc + cur, 0) / healthCheck.length) as HealthCheckRating;
};

PatientSchema.virtual('healthRating').get(function(this: PatientDoc): ReturnType<typeof healthRating> {
    return healthRating(this.entries);
});

PatientSchema.set('toJSON', {
    virtuals: true,
    transform: (_document, returnedObject) => {
      returnedObject.id = (returnedObject._id as string).toString();
      delete returnedObject._id;
      delete returnedObject.__v;
    }
});

PatientSchema.set('toObject', { virtuals: true });

PatientSchema.method('toPublicPatient', function (this: PatientDoc): Promise<PublicPatient> {
    // populate entries so that healthRating calulation is correct
    return this.populate('entries').then(pop => {
        return {
            id: (pop._id as string).toString(),
            name: pop.name,
            dateOfBirth: pop.dateOfBirth,
            gender: pop.gender,
            occupation: pop.occupation,
            healthRating: pop.healthRating
        };
    });
});

PatientSchema.plugin(mongooseUniqueValidator);

export default mongoose.model<PatientDoc>('Patient', PatientSchema, 'Patients');