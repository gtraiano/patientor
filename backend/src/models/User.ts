import mongoose, { Schema, Document } from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import { User } from '../types';

export interface UserDoc extends User, Document {
    id: string
};

const UserSchema = new Schema<UserDoc>({
    name: {
        type: String,
        required: false
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    
    password: {
        type: String,
        required: true
    },
    
    createdAt: {
        type: Number,
        required: true,
        default: Date.now()
    },
    
    roles: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role"
        }],
        required: true
    }
});

UserSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
      returnedObject.id = returnedObject._id as string;
      delete returnedObject._id;
      delete returnedObject.__v;
      delete returnedObject.password;
      delete returnedObject.createdAt;
    }
});

UserSchema.plugin(mongooseUniqueValidator);

export default mongoose.model<UserDoc>('User', UserSchema, 'Users');