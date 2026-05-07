const express = require('express');
const router = express.Router();
const FileStore = require('../models/FileStore');

router.get('/:userId', (req, res) => {
  try {
    const notifications = FileStore.getNotifications(req.params.userId);
    res.json({ success: true, data: notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
