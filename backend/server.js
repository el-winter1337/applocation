const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors());
app.use(express.json()); 

// Serve uploaded images statically
app.use('/uploads', express.static(uploadsDir)); 

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

app.get('/', (req, res) => {
    res.send('HamroAwaaz Backend is running!');
});

// ADD THIS NEW LINE RIGHT HERE:
app.use('/api/reports', require('./routes/reportRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`✓ Listening on 0.0.0.0 (all interfaces)`);
    console.log(`✓ Accessible from Android emulator at http://10.0.2.2:${PORT}`);
});