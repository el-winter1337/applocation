const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data.json');

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ reports: [] }, null, 2));
}

class FileStore {
  static getAllReports() {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    return data.reports;
  }

  static saveReport(report) {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    const newReport = {
      _id: Date.now().toString(),
      ...report,
      createdAt: new Date()
    };
    data.reports.push(newReport);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return newReport;
  }

  static updateReport(id, updates) {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    const report = data.reports.find(r => r._id === id);
    if (report) {
      Object.assign(report, updates);
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    }
    return report;
  }
}

module.exports = FileStore;
