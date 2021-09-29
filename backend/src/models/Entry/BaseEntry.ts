import mongoose, { Schema, Document } from 'mongoose';
import { EntryType, BaseEntry } from '../../types';
//import { BaseEntry } from '../types';

export interface BaseEntryDoc extends BaseEntry, Document {
    id: string
};
//export interface IHealthCheckEntryModel extends Model<IHealthCheckEntryDoc> {};

export const BaseEntrySchema: Schema = new Schema<BaseEntryDoc>({
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
        type: [String],
        ref: 'Diagnosis',
        required: false,
        //default: []
    },
    type: {
        type: String,
        enum: {
            values: Object.keys(EntryType),
            message: '{VALUE} is not supported'
        },
        required: true
    },
});

export default mongoose.model<BaseEntryDoc>('BaseEntry', BaseEntrySchema);