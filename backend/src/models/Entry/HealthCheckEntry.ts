import { Schema, Document } from 'mongoose';
import { EntryType, HealthCheckEntry, HealthCheckRating } from '../../types';
import BaseEntryModel, { options } from './BaseEntry';

export interface HealthCheckEntryDoc extends HealthCheckEntry, Document {
    id: string
};

export const HealthCheckEntrySchema = new Schema<HealthCheckEntryDoc>({
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