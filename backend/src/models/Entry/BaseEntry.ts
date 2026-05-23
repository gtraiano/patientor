import mongoose, { Schema, Document, Types } from 'mongoose';
import { EntryType, BaseEntry } from '../../types';

export interface BaseEntryDoc extends BaseEntry, Document {
    id: string,
    patientId: Types.ObjectId,
    authorId: Schema.Types.ObjectId
}

export const options = { discriminatorKey: 'type' };

export const BaseEntrySchema: Schema = new Schema<BaseEntryDoc>(
    {
        // implementing the one to many relationship between patient and entry
        // entries are the "many" part
        patientId: {
            type: Schema.Types.ObjectId,
            ref: 'Patient',
            required: true
        },
        authorId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
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
            required: false
        },
        type: {
            type: String,
            enum: {
                values: Object.values(EntryType),
                message: '{VALUE} is not supported'
            },
            required: true
        },
    },
    options
);

BaseEntrySchema.set('toJSON', {
    transform: (_document, returnedObject: Record<string, unknown>) => {
        returnedObject.id = String(returnedObject._id);
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

export default mongoose.model<BaseEntryDoc>('Entry', BaseEntrySchema, 'Entries');