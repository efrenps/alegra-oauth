import mongoose from 'mongoose';

const { Schema } = mongoose;

const Client = new Schema({
    name: String,
    clientId: String,
    clientSecret: String,
    redirectUris: {
      type: [String]
    },
    grants: {
      type: [String],
      default: ['authorization_code', 'password', 'refresh_token', 'client_credentials']
    },
    scope: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' }
  });


export default mongoose.model('Client', Client);