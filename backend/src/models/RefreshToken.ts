import mongoose, { Schema } from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import { RefreshToken } from '../types';

const RefreshTokenSchema = new Schema<RefreshToken>({
    token: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: String,
        required: true,
        unique: true
    },
    expires: {
        type: Date,
        required: true
    }
});

RefreshTokenSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
      returnedObject.id = returnedObject._id as string;
      delete returnedObject._id;
      delete returnedObject.__v;
    }
});

RefreshTokenSchema.plugin(mongooseUniqueValidator);

export default mongoose.model<RefreshToken>('RefreshToken', RefreshTokenSchema, 'RefreshTokens');