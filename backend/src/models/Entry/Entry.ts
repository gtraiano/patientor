import mongoose, { Schema } from 'mongoose';
import { HospitalEntryDoc } from './HospitalEntry';
import { HealthCheckEntryDoc } from './HealthCheckEntry';
import { OccupationalHealthcareEntryDoc } from './OccupationalHealthcareEntry';


export type EntryDoc = HospitalEntryDoc | HealthCheckEntryDoc | OccupationalHealthcareEntryDoc;

export const EntrySchema = new Schema<EntryDoc>();

/*EntrySchema.set('toJSON', {
    transform: (_document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
    }
});*/

export default mongoose.model<EntryDoc>('Entry', EntrySchema);