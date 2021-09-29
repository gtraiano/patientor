import mongoose, { Schema, Document } from 'mongoose';
import { HospitalEntry } from '../../types';
import { BaseEntrySchema } from './BaseEntry';

export interface HospitalEntryDoc extends HospitalEntry, Document {
    id: string
};
//export interface IHealthCheckEntryModel extends Model<IHealthCheckEntryDoc> {};

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

/*HospitalEntrySchema.set('toJSON', {
    transform: (_document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
});

export default mongoose.model<HospitalEntry>('HospitalEntry', HospitalEntrySchema);*/

/*const HospitalEntrySchema: Schema = new Schema<HospitalEntry, Model<HospitalEntry>, HospitalEntry>({
    description: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    specialist: {
        type: String,
        required: true
    },
    diagnosisCodes: {
        //type: [IDiagnosisModel['code']],
        type: {
            type: [String],
            ref: 'Diagnosis'
        },
        required: false,
        default: []
    },
    type: {
        type: String,
        default: EntryType.Hospital,
        required: true
    },
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

HospitalEntrySchema.set('toJSON', {
    transform: (_document, returnedObject) => {
      //returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
});

//export default mongoose.model<IHealthCheckEntry>('HealthCheckEntry', HealthCheckEntrySchema);
export default mongoose.model<HospitalEntry>('HealthCheckEntry', HospitalEntrySchema);*/