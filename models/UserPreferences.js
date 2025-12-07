const mongoose = require('mongoose');

const userPreferencesSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  preferredLanguages: [{ type: String }], 
  preferredSkills: [{ type: String }], 
  maxDistance: { type: Number, default: 50 }, 
  minAge: { type: Number, min: 18 },
  maxAge: { type: Number }
}, { timestamps: true });









module.exports = mongoose.model('UserPreferences', userPreferencesSchema);
