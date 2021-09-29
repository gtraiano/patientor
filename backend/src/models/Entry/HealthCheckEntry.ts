import mongoose, { Schema, Document } from 'mongoose';
import { HealthCheckEntry, HealthCheckRating } from '../../types';
import { BaseEntrySchema } from './BaseEntry';

export interface HealthCheckEntryDoc extends HealthCheckEntry, Document {
    id: string
};
//export interface IHealthCheckEntryModel extends Model<IHealthCheckEntryDoc> {};

export const HealthCheckEntrySchema = new Schema<HealthCheckEntryDoc>({
    ...BaseEntrySchema.obj,
    /*type: {
        type: String,
        default: EntryType.HealthCheck,
        required: true
    },*/
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

/*HealthCheckEntrySchema.set('toJSON', {
    transform: (_document, returnedObject) => {
      //returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
});

//export default mongoose.model<IHealthCheckEntry>('HealthCheckEntry', HealthCheckEntrySchema);
export default mongoose.model<HealthCheckEntry>('HealthCheckEntry', HealthCheckEntrySchema);*/