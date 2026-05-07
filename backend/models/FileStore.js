const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data.json');

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ 
    reports: [],
    users: [{ _id: "1", name: "Test User", email: "user@hamroawaaz.com", password: "admin123", phone: "", address: "" }],
    notifications: []
  }, null, 2));
}

class FileStore {
  static _getData() {
    try {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      // Ensure schema backwards compatibility
      if (!data.users) data.users = [{ _id: "1", name: "Test User", email: "user@hamroawaaz.com", password: "admin123", phone: "", address: "" }];
      if (!data.notifications) data.notifications = [];
      return data;
    } catch (e) {
      return { reports: [], users: [], notifications: [] };
    }
  }

  static _saveData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  }

  // --- Reports ---
  static getAllReports() {
    return this._getData().reports;
  }

  static saveReport(report) {
    const data = this._getData();
    const newReport = {
      _id: Date.now().toString(),
      ...report,
      createdAt: new Date()
    };
    data.reports.push(newReport);
    this._saveData(data);
    return newReport;
  }

  static updateReport(id, updates) {
    const data = this._getData();
    const report = data.reports.find(r => r._id === id);
    if (report) {
      Object.assign(report, updates);
      this._saveData(data);
    }
    return report;
  }

  // --- Users ---
  static getUser(id) {
    return this._getData().users.find(u => u._id === id);
  }

  static getUserByEmail(email) {
    return this._getData().users.find(u => u.email === email);
  }

  static createUser(userData) {
    const data = this._getData();
    if (data.users.find(u => u.email === userData.email)) {
      throw new Error("Email already exists");
    }
    const newUser = {
      _id: Date.now().toString(),
      ...userData,
      savedLocations: [],
      createdAt: new Date()
    };
    data.users.push(newUser);
    this._saveData(data);
    return newUser;
  }

  static updateUser(id, updates) {
    const data = this._getData();
    const user = data.users.find(u => u._id === id);
    if (user) {
      Object.assign(user, updates);
      this._saveData(data);
    }
    return user;
  }

  // --- Notifications ---
  static getNotifications(userId) {
    return this._getData().notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  static addNotification(userId, title, message) {
    const data = this._getData();
    const notification = {
      _id: Date.now().toString(),
      userId,
      title,
      message,
      createdAt: new Date(),
      read: false
    };
    data.notifications.push(notification);
    this._saveData(data);
    return notification;
  }
}

module.exports = FileStore;
