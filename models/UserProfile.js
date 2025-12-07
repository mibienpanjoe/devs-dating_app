const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true, 
    unique: true },

  bio: { 
    type: String,
    maxlength: 500 },

  skills: [{ type: String }],  

  languages: [{ type: String }], 

  github: { type: String },

  photos: [{ type: String }],  

  location: {
     type: String,
     default: '' },
  age: { 
    type: Number,
    min: 18 }
    
}, { timestamps: true });

module.exports = mongoose.model('UserProfile', userProfileSchema);