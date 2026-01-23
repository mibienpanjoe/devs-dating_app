import mongoose, { Schema, Document } from 'mongoose';
import { IMatch } from '../types';

const matchSchema: Schema = new Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Exactly 2
  matchedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model<IMatch & Document>('Match', matchSchema);