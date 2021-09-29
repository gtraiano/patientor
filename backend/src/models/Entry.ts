import mongoose, { Schema, Document } from 'mongoose';
import { HealthCheckEntry, HospitalEntry, OccupationalHealthcareEntry, EntryType, Entry, HealthCheckRating } from '../types';


export interface EntryDoc extends Omit<HospitalEntry, 'id' | 'type'>, Omit<HealthCheckEntry, 'id' | 'type'>, Omit<OccupationalHealthcareEntry, 'id' | 'type'>, Document {};

export const EntrySchema = new Schema<Entry>({
    description: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    specialist: {
        type: String,
        required: true
    },
    diagnosisCodes: {
        type: [String],
        ref: 'Diagnosis',
        required: false,
        //default: []
    },
    type: {
        type: String,
        enum: {
            values: Object.keys(EntryType),
            message: '{VALUE} is not supported'
        },
        required: true
    },
    // hospital entry
    discharge: {
        date: {
            type: String,
            required: function(this: Entry) {
                return this.type === EntryType.Hospital
            }
        },
        criteria: {
            type: String,
            required: function(this: Entry) {
                return this.type === EntryType.Hospital
            }
        }
    },
    // health check entry
    healthCheckRating: {
        type: Number,
        required: function(this: Entry) {
            return this.type === EntryType.HealthCheck
        },
        enum: {
            values: Object.values(HealthCheckRating),
            message: '{VALUE} is not supported'
        }
    },
    // occupational healthcare
    employerName: {
        type: String,
        required: function(this: Entry) {
            return this.type === EntryType.OccupationalHealthcare
        }
    },
    sickLeave: {
        startDate: {
            type: String,
            required: function(this: Entry) {
                return this.type === EntryType.OccupationalHealthcare
            }
        },
        endDate: {
            type: String,
            required: function(this: Entry) {
                return this.type === EntryType.OccupationalHealthcare
            }
        }
    }
});

EntrySchema.set('toJSON', {
    transform: (_document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
    }
});

export default mongoose.model<Entry>('Entry', EntrySchema);