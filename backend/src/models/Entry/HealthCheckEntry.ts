import { Schema } from 'mongoose';
import { EntryType, HealthCheckEntry, HealthCheckRating } from '../../types';
import BaseEntryModel, { BaseEntryDoc, options } from './BaseEntry';

export interface HealthCheckEntryDoc extends HealthCheckEntry, BaseEntryDoc {
    id: string,
    type: EntryType.HealthCheck
}

export const HealthCheckEntrySchema = new Schema<HealthCheckEntryDoc>(
    {
        healthCheckRating: {
            type: Number,
            required: true,
            enum: {
                values: Object.values(HealthCheckRating),
                message: '{VALUE} is not supported'
            }
        }
    },
    options
);

export default BaseEntryModel.discriminator<HealthCheckEntryDoc>(EntryType.HealthCheck, HealthCheckEntrySchema);