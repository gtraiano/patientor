import mongoose, { Schema, Document } from 'mongoose';
import { OccupationalHealthcareEntry } from '../../types';
import { BaseEntrySchema } from './BaseEntry';

export interface OccupationalHealthcareEntryDoc extends OccupationalHealthcareEntry, Document {
    id: string
};

export const OccupationalHealthcareEntrySchema = new Schema<OccupationalHealthcareEntryDoc>({
    ...BaseEntrySchema.obj,
    employerName: {
        type: String,
        required: true
    },
    sickLeave: {
        startDate: {
            type: String,
            required: false
        },
        endDate: {
            type: String,
            required: false
        }
    }
});

export default mongoose.model<OccupationalHealthcareEntryDoc>('OccupationalHealthcareEntry', OccupationalHealthcareEntrySchema);