/* eslint-disable no-unused-vars */
import mongoose from 'mongoose';

const { Schema } = mongoose;

const Scope = new Schema({
    scope: String,
    is_default: Boolean
});

export default mongoose.model('Scope', Scope);
