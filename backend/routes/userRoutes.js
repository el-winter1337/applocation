const express = require('express');
const router = express.Router();
const FileStore = require('../models/FileStore');

router.get('/:id', (req, res) => {
  try {
    const user = FileStore.getUser(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:id', (req, res) => {
  try {
    const updatedUser = FileStore.updateUser(req.params.id, req.body);
    if (!updatedUser) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: updatedUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
