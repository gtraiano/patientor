import mongoose, { Schema, Document } from 'mongoose';
import { HospitalEntry } from '../../types';
import { BaseEntrySchema } from './BaseEntry';

export interface HospitalEntryDoc extends HospitalEntry, Document {
    id: string
};

export const HospitalEntrySchema: Schema = new Schema<HospitalEntryDoc>({
    ...BaseEntrySchema.obj,
    discharge: {
        date: {
            type: String,
            required: true
        },
        criteria: {
            type: String,
            required: true
        }
    }
});

export default mongoose.model<HospitalEntryDoc>('HospitalEntry', HospitalEntrySchema);
