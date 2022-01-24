/* eslint-disable import/extensions */
/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose';

const { Schema } = mongoose;

const AccessToken = new Schema({
    accessToken: String,
    accessTokenExpiresAt: Date,
    scope: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    client: { type: Schema.Types.ObjectId, ref: 'Client' }
});

export default mongoose.model('AccessToken', AccessToken);
