import mongoose, { Schema, Document } from 'mongoose';
import { HealthCheckEntry, HealthCheckRating } from '../../types';
import { BaseEntrySchema } from './BaseEntry';

export interface HealthCheckEntryDoc extends HealthCheckEntry, Document {
    id: string
};

export const HealthCheckEntrySchema = new Schema<HealthCheckEntryDoc>({
    ...BaseEntrySchema.obj,
    healthCheckRating: {
        type: Number,
        required: true,
        enum: {
            values: Object.values(HealthCheckRating),
            message: '{VALUE} is not supported'
        }
    }
});

export default mongoose.model<HealthCheckEntryDoc>('HealthCheckEntry', HealthCheckEntrySchema);