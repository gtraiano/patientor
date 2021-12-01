import { Schema, Document } from 'mongoose';
import { EntryType, OccupationalHealthcareEntry } from '../../types';
import BaseEntryModel, { options } from './BaseEntry';

export interface OccupationalHealthcareEntryDoc extends OccupationalHealthcareEntry, Document {
    id: string
};

export const OccupationalHealthcareEntrySchema = new Schema<OccupationalHealthcareEntryDoc>({
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
},
options);

export default BaseEntryModel.discriminator<OccupationalHealthcareEntryDoc>(EntryType.OccupationalHealthcare, OccupationalHealthcareEntrySchema);