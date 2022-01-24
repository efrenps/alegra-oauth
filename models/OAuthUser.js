import mongoose from 'mongoose';

const { Schema } = mongoose;

const User = new Schema({
    username: String,
    password: String,
    scope: String
  });

export default mongoose.model('User', User);
