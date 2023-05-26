import { Schema } from 'mongoose';
import { EntryType, OccupationalHealthcareEntry } from '../../types';
import BaseEntryModel, { BaseEntryDoc, options } from './BaseEntry';

export interface OccupationalHealthcareEntryDoc extends OccupationalHealthcareEntry, BaseEntryDoc {
    id: string,
    type: EntryType.OccupationalHealthcare
}

export const OccupationalHealthcareEntrySchema = new Schema<OccupationalHealthcareEntryDoc>(
    {
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
    options
);

export default BaseEntryModel.discriminator<OccupationalHealthcareEntryDoc>(EntryType.OccupationalHealthcare, OccupationalHealthcareEntrySchema);