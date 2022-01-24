/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose';

const { Schema } = mongoose;

const AuthorizationCode = new Schema({
    code: String,
    expiresAt: Date,
    redirectUri: String,
    scope: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    client: { type: Schema.Types.ObjectId, ref: 'Client' }
  });

export default mongoose.model('AuthorizationCode', AuthorizationCode);
