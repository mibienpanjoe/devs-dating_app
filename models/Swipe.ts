import mongoose, { Schema, Document } from 'mongoose';
import { ISwipe } from '../types';

const swipeSchema: Schema = new Schema({
  swiper: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  swiped: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, enum: ['like', 'pass'], required: true }
}, { timestamps: true });

swipeSchema.index({ swiper: 1, swiped: 1 }, { unique: true });

export default mongoose.model<ISwipe & Document>('Swipe', swipeSchema);