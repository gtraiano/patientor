import mongoose, { Schema, Document } from 'mongoose';
import { OccupationalHealthcareEntry } from '../../types';
import { BaseEntrySchema } from './BaseEntry';

export interface OccupationalHealthcareEntryDoc extends OccupationalHealthcareEntry, Document {
    id: string
};
//export interface IHealthCheckEntryModel extends Model<IHealthCheckEntryDoc> {};

export const OccupationalHealthcareEntrySchema = new Schema<OccupationalHealthcareEntryDoc>({
    ...BaseEntrySchema.obj,
    /*type: {
        type: String,
        default: EntryType.OccupationalHealthcare,
        required: true
    },*/
    employerName: {
        type: String,
        required: true
    },
    sickLeave: {
        startDate: {
            type: String,
            required: true
        },
        endDate: {
            type: String,
            required: true
        }
    }
});

export default mongoose.model<OccupationalHealthcareEntryDoc>('OccupationalHealthcareEntry', OccupationalHealthcareEntrySchema);

/*OccupationalHealthcareEntrySchema.set('toJSON', {
    transform: (_document, returnedObject) => {
      //returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
});

export default mongoose.model<OccupationalHealthcareEntry>('OccupationalHealthcareEntry', OccupationalHealthcareEntrySchema);*/