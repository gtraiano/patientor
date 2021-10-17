import mongoose, { Schema, Document } from 'mongoose';
import { EntryType, BaseEntry } from '../../types';

export interface BaseEntryDoc extends BaseEntry, Document {
    id: string
};

export const BaseEntrySchema: Schema = new Schema<BaseEntryDoc>(
    {
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
                values: Object.keys(EntryType),
                message: '{VALUE} is not supported'
            },
            required: true
        },
    },
    { discriminatorKey: 'type' }
);

BaseEntrySchema.set('toJSON', {
    transform: (_document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
    }
});

export default mongoose.model<BaseEntryDoc>('BaseEntry', BaseEntrySchema);