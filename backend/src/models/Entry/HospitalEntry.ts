import { Schema, Document } from 'mongoose';
import { EntryType, HospitalEntry } from '../../types';
import BaseEntryModel from './BaseEntry';

export interface HospitalEntryDoc extends HospitalEntry, Document {
    id: string
};

export const HospitalEntrySchema: Schema = new Schema<HospitalEntryDoc>({
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

export default BaseEntryModel.discriminator<HospitalEntryDoc>(EntryType.Hospital, HospitalEntrySchema);
