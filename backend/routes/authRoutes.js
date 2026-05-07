const express = require('express');
const router = express.Router();
const FileStore = require('../models/FileStore');

router.post('/register', (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }
    const newUser = FileStore.createUser({ email, password, name });
    res.json({ success: true, user: newUser });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    const user = FileStore.getUserByEmail(email);
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/admin-login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@hamroawaaz.gov.np' && password === 'admin123') {
    res.json({ success: true, user: { name: 'Admin Supervisor', role: 'Super' } });
  } else {
    res.status(401).json({ success: false, message: 'Invalid Credentials' });
  }
});

module.exports = router;
