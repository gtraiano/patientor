import mongoose, { Schema } from 'mongoose';
import { Diagnosis } from "../types";
import mongooseUniqueValidator from 'mongoose-unique-validator';

const DiagnosisSchema = new Schema<Diagnosis>({
    code: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    latin: {
        type: String,
        required: false
    }
});

DiagnosisSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        const obj = returnedObject as unknown as Record<string, unknown>;
        obj.id = String(returnedObject._id);
        delete obj._id;
        delete obj.__v;
    }
});

DiagnosisSchema.plugin(mongooseUniqueValidator);

export default mongoose.model<Diagnosis>('Diagnosis', DiagnosisSchema, 'Diagnoses');