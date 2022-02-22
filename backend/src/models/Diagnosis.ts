import mongoose, { Schema } from 'mongoose';
import { Diagnosis } from "../types"
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
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
    }
});

DiagnosisSchema.plugin(mongooseUniqueValidator);

export default mongoose.model<Diagnosis & mongoose.Document>('Diagnosis', DiagnosisSchema, 'Diagnoses');