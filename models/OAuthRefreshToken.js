import mongoose from 'mongoose';

const { Schema } = mongoose;

const RefreshToken = new Schema({
    refreshToken: String,
    refreshTokenExpiresAt: Date,
    scope: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    client: { type: Schema.Types.ObjectId, ref: 'Client' },
  });

export default mongoose.model('RefreshToken', RefreshToken);
