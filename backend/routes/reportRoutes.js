const express = require('express');
const router = express.Router();
const FileStore = require('../models/FileStore');
const multer = require('multer');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage }); 

// 1. GET ALL REPORTS ROUTE
router.get('/all', (req, res) => {
  try {
    const reports = FileStore.getAllReports();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. UPDATE REPORT ROUTE (Status & Officer Assignment)
router.put('/:id', (req, res) => {
  try {
    const { status, assignedOfficer } = req.body;
    
    const updatedReport = FileStore.updateReport(req.params.id, { status, assignedOfficer });
    
    if (!updatedReport) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    // Add notification when updated
    if (status) {
      FileStore.addNotification("1", "Report Updated", `Your report (ID: ${req.params.id}) status is now ${status}.`);
    }

    res.json({ success: true, message: "Report updated successfully", data: updatedReport });
  } catch (err) {
    console.error("Error updating report:", err);
    res.status(500).json({ success: false, message: "Error updating report" });
  }
});

// 3. CREATE / SUBMIT REPORT HANDLER
const createReportHandler = (req, res) => {
  try {
    const { category, location, latitude, longitude, description, ward, username, userId } = req.body;

    console.log('📥 Received report submission:');
    console.log('  Category:', category);
    console.log('  Location:', location);
    console.log('  Description:', description);
    console.log('  Image:', req.file ? req.file.filename : 'No image');

    const newReport = FileStore.saveReport({
      category,
      location,
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
      description,
      imageUrl: req.file ? req.file.path : undefined,
      ward,
      username,
      userId,
      status: 'Pending',
      assignedOfficer: 'Unassigned'
    });

    console.log('✅ Report saved:', newReport._id);
    res.status(201).json({ success: true, data: newReport });
  } catch (err) {
    console.error('❌ Error creating report:', err);
    res.status(500).json({ success: false, message: 'Failed to create report', error: err.message });
  }
};

router.post('/', upload.single('photo'), createReportHandler);
router.post('/submit', upload.single('photo'), createReportHandler);

module.exports = router;