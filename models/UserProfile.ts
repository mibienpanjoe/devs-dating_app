import mongoose, { Schema, Document } from 'mongoose';
import { IUserProfile } from '../types';

const userProfileSchema: Schema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  bio: {
    type: String,
    maxlength: 500
  },
  skills: [{ type: String }],
  languages: [{ type: String }],
  github: { type: String },
  photos: [{ type: String }],
  location: {
    type: String,
    default: ''
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    index: '2dsphere'
  },
  age: {
    type: Number,
    min: 18
  }
}, { timestamps: true });

export default mongoose.model<IUserProfile & Document>('UserProfile', userProfileSchema);