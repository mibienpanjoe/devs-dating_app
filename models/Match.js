const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],  // Exactly 2
  matchedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Match', matchSchema);