import mongoose, { Schema, Document } from 'mongoose';
import { IUserPreferences } from '../types';

const userPreferencesSchema: Schema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  preferredLanguages: [{ type: String }],
  preferredSkills: [{ type: String }],
  maxDistance: { type: Number, default: 50 },
  minAge: { type: Number, min: 18 },
  maxAge: { type: Number }
}, { timestamps: true });

export default mongoose.model<IUserPreferences & Document>('UserPreferences', userPreferencesSchema);