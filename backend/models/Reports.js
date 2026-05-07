const mongoose = require('mongoose');

// This defines the exact data structure based on your HamroAwaaz requirements
const reportSchema = new mongoose.Schema({
  reporterName: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Waste', 'Road Damage', 'Streetlight', 'Drainage', 'Other'], 
    required: true 
  },
  location: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String }, // We will hook this up to the camera later
  status: { 
    type: String, 
    enum: ['Pending', 'In Progress', 'Resolved'], 
    default: 'Pending' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);