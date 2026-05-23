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
        const obj = returnedObject as unknown as Record<string, unknown>;
        obj.id = String(returnedObject._id);
        delete obj._id;
        delete obj.__v;
    }
});

RefreshTokenSchema.plugin(mongooseUniqueValidator);

export default mongoose.model<RefreshToken>('RefreshToken', RefreshTokenSchema, 'RefreshTokens');