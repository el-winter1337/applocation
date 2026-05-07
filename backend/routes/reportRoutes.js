const express = require('express');
const router = express.Router();
// IMPORTANT: Make sure this path points to your actual Report model
const Report = require('../models/Report');
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
router.get('/all', async (req, res) => {
  try {
    const reports = await Report.find();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. UPDATE REPORT ROUTE (Status & Officer Assignment)
router.put('/:id', async (req, res) => {
  try {
    const { status, assignedOfficer } = req.body;
    
    const updatedReport = await Report.findByIdAndUpdate(
      req.params.id, 
      { status, assignedOfficer }, 
      { returnDocument: 'after' }
    );
    
    if (!updatedReport) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    res.json({ success: true, message: "Report updated successfully", data: updatedReport });
  } catch (err) {
    console.error("Error updating report:", err);
    res.status(500).json({ success: false, message: "Error updating report" });
  }
});

// 3. CREATE / SUBMIT REPORT HANDLER
const createReportHandler = async (req, res) => {
  try {
    const { category, location, latitude, longitude, description, ward, username } = req.body;

    const newReport = new Report({
      category,
      location,
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
      description,
      imageUrl: req.file ? req.file.path : undefined,
      ward,
      username,
    });

    const saved = await newReport.save();
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    console.error('Error creating report:', err);
    res.status(500).json({ success: false, message: 'Failed to create report' });
  }
};

router.post('/', upload.single('photo'), createReportHandler);
router.post('/submit', upload.single('photo'), createReportHandler);

module.exports = router;