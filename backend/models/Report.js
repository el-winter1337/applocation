const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  category: String,
  location: String,
  latitude: Number,
  longitude: Number,
  description: String,
  imageUrl: String,
  username: String,
  // 🚀 NEW: Add the ward field here
  ward: { type: String, default: 'Unspecified' }, 
  status: { type: String, default: 'Pending' },
  assignedOfficer: { type: String, default: 'Unassigned' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);