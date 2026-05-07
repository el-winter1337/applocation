const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json()); 

// Serve uploaded images statically
app.use('/uploads', express.static('uploads')); 

// Add this to your backend server.js
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  // For your FYP, use a simple check. In production, use a Database & JWT.
  if (email === 'admin@hamroawaaz.gov.np' && password === 'admin123') {
    res.json({ success: true, user: { name: 'Admin Supervisor', role: 'Super' } });
  } else {
    res.status(401).json({ success: false, message: 'Invalid Credentials' });
  }
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB Atlas!'))
  .catch((err) => {
      console.error('Failed to connect to MongoDB!');
      console.error(err.message);
  });

app.get('/', (req, res) => {
    res.send('HamroAwaaz Backend is running!');
});

// ADD THIS NEW LINE RIGHT HERE:
app.use('/api/reports', require('./routes/reportRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});