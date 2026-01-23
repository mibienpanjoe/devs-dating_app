import mongoose, { Schema, Document } from 'mongoose';
import { IMessage } from '../types';

const messageSchema: Schema = new Schema({
  match: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, maxlength: 1000 },
  read: { type: Boolean, default: false },
  delivered: { type: Boolean, default: false }
}, { timestamps: true });

messageSchema.index({ match: 1, createdAt: -1 });

export default mongoose.model<IMessage & Document>('Message', messageSchema);