import { Schema } from 'mongoose';
import { EntryType, HospitalEntry } from '../../types';
import BaseEntryModel, { BaseEntryDoc, options } from './BaseEntry';

export interface HospitalEntryDoc extends HospitalEntry, BaseEntryDoc {
    id: string,
    type: EntryType.Hospital
}

export const HospitalEntrySchema: Schema = new Schema<HospitalEntryDoc>(
    {
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
    },
    options
);

export default BaseEntryModel.discriminator<HospitalEntryDoc>(EntryType.Hospital, HospitalEntrySchema);
