import mongoose, { Schema, Document } from 'mongoose';
import { IReport } from '../types';

const reportSchema: Schema = new Schema({
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reported: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, required: true, maxlength: 500 },
  status: { type: String, enum: ['pending', 'reviewed', 'resolved'], default: 'pending' }
}, { timestamps: true });

reportSchema.index({ reporter: 1, reported: 1 }, { unique: true });

export default mongoose.model<IReport & Document>('Report', reportSchema);