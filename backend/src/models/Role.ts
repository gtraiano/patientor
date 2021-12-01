import mongoose, { Schema, Document } from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import { Role, Roles } from '../types';

export interface RoleDoc extends Role, Document {
    id: string
};

const RoleSchema = new Schema<RoleDoc>({
    name: {
        type: String,
        enum: {
            values: Object.values(Roles),
            message: '{VALUE} is not a valid role'
        },
        unique: true
    }
});

RoleSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
    }
});

RoleSchema.plugin(mongooseUniqueValidator);

export default mongoose.model<RoleDoc>('Role', RoleSchema, 'Roles');