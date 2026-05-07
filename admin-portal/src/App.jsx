import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import ErrorBoundary from './ErrorBoundary';
// 1. LUCIDE ICONS (Combined and cleaned)
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar, Legend, Label 
} from 'recharts';
import {
  LayoutDashboard,
  Map as MapIcon,
  FileText,
  Users,
  Settings,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  Download,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  X,
  Activity,
  Zap,
  PieChart as PieChartIcon,
  Target,
  LayoutGrid,
  CheckSquare,
  Trash2,
  CalendarDays,
  Mail,
  BarChart3,
  Clock3,
} from "lucide-react";


// 3. LEAFLET ASSET FIX
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});


L.Marker.prototype.options.icon = DefaultIcon;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/reports/all`;

export default function HamroAwaazAdminPortal() {
  const [reports, setReports] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("adminAuth") === "true");
  const [selectedReport, setSelectedReport] = useState(null);
  const location = useLocation();

  const fetchReports = async () => {
    try {
      const res = await axios.get(API_URL, { headers: { "ngrok-skip-browser-warning": "true" } });
      console.log("✓ Reports fetched:", res.data);
      setReports(Array.isArray(res.data) ? res.data.reverse() : []);
    } catch (err) { 
      console.error("Database sync failed.", err);
      setReports([]);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchReports();
      // Refetch every 3 seconds
      const interval = setInterval(fetchReports, 3000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleUpdateReport = async (reportId, updatedData) => {
    try {
      await axios.put(`${API_BASE_URL}/api/reports/${reportId}`, updatedData, {
        headers: { "ngrok-skip-browser-warning": "true" }
      });
      fetchReports();
      setSelectedReport(null);
      alert("Success: Complaint updated!");
    } catch (err) {
      alert("Failed to update report. Ensure your backend PUT route is active.");
      console.error(err);
    }
  };

  if (!isAuthenticated) return <LoginPage onLogin={() => setIsAuthenticated(true)} />;

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row bg-[#f4f7f9] font-sans text-slate-800 overflow-x-hidden">
      
      {/* LEFT SIDEBAR */}
      <aside className="w-full lg:w-[280px] lg:h-screen bg-[#1a2235] text-white flex flex-col shrink-0 z-20 overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
        <div className="p-4 sm:p-6 flex items-center gap-3 mb-2 w-full">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-black text-lg tracking-tighter shadow-lg shrink-0">HA</div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold tracking-tight leading-none mb-1 truncate">HamroAwaaz</h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest truncate">Admin Portal</p>
          </div>
        </div>

        <nav className="flex-1 px-3 sm:px-4 space-y-1.5 overflow-y-auto max-h-[280px] lg:max-h-none">
          <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" active={location.pathname === "/"} />
          <SidebarItem to="/map" icon={MapIcon} label="Live Map" active={location.pathname === "/map"} />
          <SidebarItem to="/complaints" icon={FileText} label="Complaints" active={location.pathname === "/complaints"} badge={reports.length > 0 ? reports.length : null} />
          <SidebarItem to="/field" icon={Users} label="Field Management" active={location.pathname === "/field"} />
          <SidebarItem 
  to="/analytics" 
  icon={BarChart3} // 🚀 Change 2 to 3 here
  label="Analytics" 
  active={location.pathname === "/analytics"} 
/>
          <SidebarItem to="/settings" icon={Settings} label="Settings" active={location.pathname === "/settings"} />
        </nav>

        <div className="p-4 sm:p-6 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold text-sm shadow-inner">AS</div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">Admin Supervisor</p>
              <p className="text-[11px] text-slate-400 truncate">admin@hamroawaaz.gov.np</p>
            </div>
          </div>
          <button onClick={() => { localStorage.clear(); setIsAuthenticated(false); }} className="flex items-center text-slate-400 hover:text-red-400 transition-colors text-sm font-semibold px-2">
            <LogOut size={16} className="mr-3" /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col relative min-w-0 lg:h-screen overflow-visible lg:overflow-hidden">
        
        {/* HEADER */}
        <header className="min-h-[80px] bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 shrink-0 z-10">
          <div className="flex items-center bg-slate-50 rounded-full px-4 sm:px-5 py-2.5 w-full lg:w-[450px] border border-slate-200 focus-within:ring-2 ring-blue-100 transition-all">
            <Search className="text-slate-400 mr-3 shrink-0" size={18} />
            <input type="text" placeholder="Search complaints..." className="bg-transparent border-none outline-none w-full text-sm text-slate-700" />
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 self-end lg:self-auto">
            
            {/* 🚀 FIXED: The Bell is now a clickable Link to the Activity Log */}
            <Link to="/activity" className="relative text-slate-400 hover:text-blue-600 transition-colors">
              <Bell size={22} />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </Link>

            <div className="flex items-center gap-3 pl-0 lg:pl-6 lg:border-l border-slate-200 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs">AS</div>
              <span className="text-sm font-bold text-slate-700">Admin Supervisor <ChevronDown size={14} className="inline ml-1 text-slate-400"/></span>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT WRAPPER */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 relative">
          <Routes>
            <Route path="/" element={<DashboardView reports={reports} />} />
            <Route path="/complaints" element={<ComplaintsView reports={reports} onViewReport={setSelectedReport} />} />
            <Route path="/field" element={<FieldManagementView reports={reports} onViewReport={setSelectedReport} />} />
           <Route 
  path="/analytics" 
  element={
    <ErrorBoundary>
      <AnalyticsView reports={reports} />
    </ErrorBoundary>
  } 
/>
            <Route path="/map" element={<LiveMapView reports={reports} />} />
            <Route path="/settings" element={<SettingsView />} />
            {/* 🚀 NEW: Activity Log Route */}
            <Route path="/activity" element={<ActivityLogView />} />
            <Route path="*" element={<div className="text-center mt-20 text-slate-400">Page under construction</div>} />
          </Routes>
        </div>

        {/* DETAILED MODAL OVERLAY */}
        {selectedReport && (
          <ReportDetailModal 
            report={selectedReport} 
            onClose={() => setSelectedReport(null)} 
            onSave={handleUpdateReport} 
          />
        )}
      </main>
    </div>
  );
}
// ==========================================
// 🚀 ACTIVITY / AUDIT LOG VIEW (WITH PDF EXPORT)
// ==========================================
function ActivityLogView() {
  const activities = [
    { id: 1, user: "Admin Supervisor", action: "Changed status of HA-1005 to 'In Progress'", time: "10 mins ago", icon: <AlertCircle size={16}/>, color: "text-amber-600 bg-amber-50 border-amber-100" },
    { id: 2, user: "Admin Supervisor", action: "Assigned Field Officer Ram Bahadur to case HA-1004", time: "1 hour ago", icon: <Users size={16}/>, color: "text-blue-600 bg-blue-50 border-blue-100" },
    { id: 3, user: "Admin Supervisor", action: "Exported Central Registry Data as CSV", time: "3 hours ago", icon: <Download size={16}/>, color: "text-green-600 bg-green-50 border-green-100" },
    { id: 4, user: "System", action: "New complaint HA-1006 received from Mobile App", time: "5 hours ago", icon: <FileText size={16}/>, color: "text-purple-600 bg-purple-50 border-purple-100" },
    { id: 5, user: "Admin Supervisor", action: "Logged into Admin Portal", time: "1 day ago", icon: <CheckCircle2 size={16}/>, color: "text-slate-600 bg-slate-100 border-slate-200" }
  ];

  // 📄 THE MAGIC PDF FUNCTION
  const generatePDF = () => {
    const doc = new jsPDF();

    // 1. Add Title and Metadata
    doc.setFontSize(18);
    doc.text("System Activity Log - HamroAwaaz", 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100); // Gray color
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    doc.text("Generated by: Admin Supervisor", 14, 36);

    // 2. Prepare Data for the Table
    const tableColumns = ["ID", "Action By", "Action Details", "Time"];
    const tableRows = activities.map(act => [
      act.id,
      act.user,
      act.action,
      act.time
    ]);

    // 3. Draw the Table
    // ✅ THIS IS THE FIX
    autoTable(doc, {
  head: [tableColumns],
  body: tableRows,
  startY: 45,
  styles: { fontSize: 10, cellPadding: 4 },
  headStyles: { fillColor: [37, 99, 235] }, 
  alternateRowStyles: { fillColor: [248, 250, 252] } 
});
    // 4. Save and Download
    doc.save(`HamroAwaaz_AuditLog_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm w-full max-w-none min-h-[700px] flex flex-col p-5 sm:p-6 lg:p-8 animate-in fade-in duration-300">
      <div className="mb-6 sm:mb-8 border-b border-slate-100 pb-5 sm:pb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center">
            <Activity className="text-blue-600 mr-3" size={24} /> System Activity Log
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">Record of all administrative actions</p>
        </div>
        
        {/* 🚀 FIXED: Connected the onClick to generatePDF */}
        <button 
          onClick={generatePDF}
          className="flex items-center justify-center text-blue-600 text-sm font-bold bg-blue-50 px-5 py-2.5 rounded-xl hover:bg-blue-100 transition shadow-sm border border-blue-100 w-full sm:w-auto"
        >
          <Download size={16} className="mr-2" /> Download PDF Report
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((act) => (
          <div key={act.id} className="flex items-center justify-between p-5 border border-slate-100 rounded-2xl hover:border-blue-200 hover:shadow-sm transition-all bg-white group">
            <div className="flex items-center gap-5">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${act.color}`}>
                {act.icon}
              </div>
              <div>
                <p className="text-[15px] font-bold text-slate-800">{act.action}</p>
                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Action by: <span className="text-blue-600">{act.user}</span></p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-colors">
                {act.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
// ==========================================
// 2. COMPLAINTS VIEW
// ==========================================
function ComplaintsView({ reports, onViewReport }) {
  
  const downloadCSV = () => {
    const headers = ["ID", "Date", "Category", "Location", "Status", "Officer"];
    const escapeCSV = (str) => `"${String(str || '').replace(/"/g, '""')}"`;
    const rows = reports.map((r) => [
      escapeCSV(r._id), escapeCSV(new Date(r.createdAt).toLocaleDateString()),
      escapeCSV(r.category), escapeCSV(r.location), escapeCSV(r.status || "Pending"),
      escapeCSV(r.assignedOfficer || "Unassigned")
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `HamroAwaaz_Complaints_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm animate-in fade-in duration-300 w-full max-w-none min-h-[700px] flex flex-col overflow-hidden">
      
      <div className="p-4 sm:p-6 border-b border-slate-100 shrink-0">
        <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-start">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">All Complaints</h2>
            <p className="text-sm text-slate-500 mt-1">{reports.length} total records</p>
          </div>
          <button onClick={downloadCSV} className="flex items-center justify-center bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-blue-700 transition w-full sm:w-auto">
            <Download size={16} className="mr-2" /> Export CSV
          </button>
        </div>
      </div>

      <div className="w-full overflow-x-auto pb-2">
        <table className="w-full text-left min-w-[1100px]">
          <thead className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Officer</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-slate-100 text-sm whitespace-nowrap">
            {reports.map((report, i) => {
              let badgeColor = "bg-red-50 text-red-600 border-red-200"; 
              if (report.status === "In Progress") badgeColor = "bg-yellow-50 text-yellow-700 border-yellow-200";
              if (report.status === "Resolved") badgeColor = "bg-green-50 text-green-700 border-green-200";
              if (report.status === "Viewed") badgeColor = "bg-blue-50 text-blue-700 border-blue-200";

              return (
                <tr key={report._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-blue-600 text-xs">HA-{1000 + reports.length - i}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-700">{report.category}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-800 max-w-[250px] truncate" title={report.location}>
                    {report.location || "Lat/Lon Provided"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${badgeColor}`}>
                      <span className="mr-1">•</span> {report.status || "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-500">{new Date(report.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-600">{report.assignedOfficer || "Unassigned"}</td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => onViewReport(report)} className="text-blue-600 font-bold text-xs hover:underline inline-flex items-center justify-center mx-auto bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors">
                      <Eye size={14} className="mr-1"/> View Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==========================================
// 3. FIELD MANAGEMENT VIEW
// ==========================================
function FieldManagementView({ reports, onViewReport }) {
  const unassignedReports = reports.filter(r => r.status === "Pending" || r.status === "New" || !r.assignedOfficer);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 w-full max-w-none animate-in fade-in duration-300">
      
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 sm:p-6 flex flex-col max-h-none lg:max-h-[calc(100vh-140px)]">
        <h3 className="text-lg font-bold text-slate-800 flex items-center mb-6 shrink-0">
          <AlertCircle size={18} className="text-red-500 mr-2" /> Needs Attention
        </h3>
        
        <div className="space-y-4 overflow-y-auto pr-2">
          {unassignedReports.length === 0 ? (
            <p className="text-slate-400 italic text-sm text-center py-10">All tasks are assigned!</p>
          ) : (
            unassignedReports.map((report) => (
              <div key={report._id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-blue-300 transition-colors">
                <div className="flex items-center gap-4 flex-1 min-w-0 mr-4">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 border border-red-100 flex items-center justify-center shrink-0">
                    <FileText size={18}/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{report.category}</p>
                    <p className="text-xs text-slate-500 font-medium truncate">{report.location}</p>
                  </div>
                </div>
                <button onClick={() => onViewReport(report)} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-colors shrink-0">
                  Action Required
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 sm:p-6 max-h-none lg:max-h-[calc(100vh-140px)] overflow-y-auto">
        <h3 className="text-lg font-bold text-slate-800 flex items-center mb-6 shrink-0">
          <Users size={18} className="text-blue-500 mr-2" /> Officer Workload
        </h3>
        <div className="space-y-4">
          <OfficerCard name="Ram Bahadur" w="Ward 10-12" cases="7" load={60} rating="4.8" avail="Available" aColor="text-green-600 bg-green-50" />
          <OfficerCard name="Sunita Rai" w="Ward 16-18" cases="4" load={30} rating="4.6" avail="Available" aColor="text-green-600 bg-green-50" />
          <OfficerCard name="Hari Prasad" w="Ward 6-11" cases="9" load={90} rating="4.4" avail="High Load" aColor="text-red-600 bg-red-50" barColor="bg-red-500" />
          <OfficerCard name="Mina Karki" w="Ward 3-5" cases="2" load={15} rating="4.9" avail="Available" aColor="text-green-600 bg-green-50" />
        </div>
      </div>
    </div>
  );
}
// ==========================================
// USER DETAIL MODAL
// ==========================================
function UserDetailModal({ userId, onClose }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/users/${userId}`);
        if (res.data.success) {
          setUser(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch user details", err);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchUser();
  }, [userId]);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] sm:rounded-[32px] shadow-2xl w-full max-w-lg flex flex-col overflow-hidden max-h-[92vh]">
        <div className="px-5 sm:px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
          <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center">
            <Users className="text-blue-600 mr-2" size={20} /> Citizen Profile
          </h2>
          <button onClick={onClose} className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-500 transition-colors shadow-sm">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 sm:p-8 overflow-y-auto">
          {loading ? (
            <p className="text-center text-slate-500 font-bold">Loading User Details...</p>
          ) : !user ? (
            <p className="text-center text-slate-500 font-bold">User Not Found.</p>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-black text-2xl">
                  {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{user.name || "Anonymous"}</h3>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{user.email || "No Email"}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Phone</p>
                  <p className="font-bold text-slate-800">{user.phone || "Not Provided"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Gender</p>
                  <p className="font-bold text-slate-800">{user.gender || "Not Provided"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Address</p>
                  <p className="font-bold text-slate-800">{user.address || "Not Provided"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ward</p>
                  <p className="font-bold text-slate-800">{user.ward || "Not Provided"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date of Birth</p>
                  <p className="font-bold text-slate-800">{user.dob || "Not Provided"}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// UPDATED REPORT DETAIL MODAL (Enhanced Evidence & Location)
// ==========================================
function ReportDetailModal({ report, onClose, onSave }) {
  const [status, setStatus] = useState(report.status || "Pending");
  const [officer, setOfficer] = useState(report.assignedOfficer || "");
  const [showUserModal, setShowUserModal] = useState(false);
  const officersList = ["Ram Bahadur", "Sunita Rai", "Hari Prasad", "Mina Karki"];

  const handleSave = () => onSave(report._id, { status, assignedOfficer: officer });

  // Helper to determine if an image exists under various possible keys
  const evidenceImage = report.imageUrl ? `${API_BASE_URL}/${report.imageUrl}` : (report.image || report.photo || report.imageUri);

  return (
    <>
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] sm:rounded-[32px] shadow-2xl w-full max-w-5xl flex flex-col overflow-hidden max-h-[92vh]">
        
        {/* Header */}
        <div className="px-5 sm:px-8 py-5 border-b border-slate-100 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center bg-slate-50 shrink-0">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Case Management</h2>
            <p className="text-sm font-bold text-blue-600 mt-1">
              ID: HA-{report._id.substring(report._id.length - 4).toUpperCase()}
            </p>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-500 transition-colors shadow-sm">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row">
          {/* Left Side: Report Details */}
          <div className="w-full lg:w-3/5 p-5 sm:p-8 border-r-0 lg:border-r border-slate-100 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Reported By</p>
                {report.userId ? (
                  <button 
                    onClick={() => setShowUserModal(true)} 
                    className="font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center bg-blue-50 px-3 py-1 rounded-lg border border-blue-100"
                  >
                    <Users size={14} className="mr-1.5" /> {report.username || "Citizen"}
                  </button>
                ) : (
                  <p className="font-bold text-slate-800">{report.username || "Anonymous Citizen"}</p>
                )}
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Date Submitted</p>
                <p className="font-bold text-slate-800">{new Date(report.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Category</p>
                <p className="font-bold text-slate-800">{report.category}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Location</p>
                {/* Improved location display to handle raw coordinates vs addresses */}
                <p className="font-bold text-slate-800 break-words">
                  {report.location || (report.latitude ? `${report.latitude.toFixed(4)}, ${report.longitude.toFixed(4)}` : "Not Provided")}
                </p>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Description</p>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-sm font-medium text-slate-700 italic leading-relaxed">
                "{report.description || "No specific description provided by the user."}"
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Photo Evidence</p>
              {evidenceImage ? (
                <div className="relative group">
                  <img 
                    src={evidenceImage} 
                    alt="Evidence" 
                    className="w-full h-80 object-cover rounded-2xl border border-slate-200 shadow-sm"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden absolute inset-0 bg-slate-50 rounded-2xl flex-col items-center justify-center border-2 border-slate-200 border-dashed text-slate-400">
                    <X size={24} className="mb-2" />
                    <p className="font-bold">Image Failed to Load</p>
                  </div>
                </div>
              ) : (
                <div className="w-full h-40 bg-slate-50 rounded-2xl flex items-center justify-center border-2 border-slate-200 border-dashed text-slate-400 font-bold">
                  No Photo Uploaded
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Action Panel */}
          <div className="w-full lg:w-2/5 bg-slate-50 p-5 sm:p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-800 mb-6 uppercase tracking-widest flex items-center">
                <AlertCircle size={16} className="text-blue-600 mr-2"/> Action Center
              </h3>
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Current Status</label>
                  <select 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)} 
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-blue-50 transition-all cursor-pointer"
                  >
                    <option value="New">🔴 New</option>
                    <option value="Viewed">🔵 Viewed</option>
                    <option value="Pending">🟠 Pending</option>
                    <option value="In Progress">🟡 In Progress</option>
                    <option value="Resolved">🟢 Resolved</option>
                  </select>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Assign Field Officer</label>
                  <select 
                    value={officer} 
                    onChange={(e) => setOfficer(e.target.value)} 
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-blue-50 transition-all cursor-pointer"
                  >
                    <option value="">-- Unassigned --</option>
                    {officersList.map(name => <option key={name} value={name}>👮‍♂️ {name}</option>)}
                  </select>
                </div>
              </div>
            </div>

              <div className="pt-8">
              <button 
                onClick={handleSave} 
                className="w-full py-4 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/30 transition-all transform active:scale-95 flex items-center justify-center"
              >
                <CheckCircle2 size={18} className="mr-2" /> Apply Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    {showUserModal && <UserDetailModal userId={report.userId} onClose={() => setShowUserModal(false)} />}
    </>
  );
}
// ==========================================
// LOGIN PAGE
// ==========================================
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/admin-login`, { email, password });
      if (res.data.success) {
        localStorage.setItem("adminAuth", "true");
        onLogin();
      }
    } catch (err) {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#1a2235] items-center justify-center font-sans p-4">
      <div className="bg-white p-8 sm:p-12 rounded-[32px] shadow-2xl w-full max-w-md">
        <div className="flex flex-col items-center text-center mb-10"><div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center font-black text-white text-2xl mb-4 shadow-lg">HA</div><h1 className="text-2xl font-black text-slate-800 tracking-tight">Admin Portal</h1><p className="text-slate-500 text-sm mt-1 font-medium">Municipal Management System</p></div>
        <form onSubmit={handleLogin} className="space-y-5">
          <div><label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Email Address</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-5 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all text-sm" required /></div>
          <div><label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-5 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all text-sm" required /></div>
          <button type="submit" className="w-full py-4 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition shadow-lg mt-4">Secure Sign In</button>
        </form>
      </div>
    </div>
  );
}

///// ==========================================
function DashboardView({ reports }) {
  // Logic for counting statuses
  const pendingCount = reports.filter(r => r.status === "Pending" || r.status === "New").length;
  const inProgressCount = reports.filter(r => r.status === "In Progress" || r.status === "Viewed").length;
  const resolvedCount = reports.filter(r => r.status === "Resolved").length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 w-full max-w-none">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <KPICard title="TOTAL COMPLAINTS" value={reports.length} icon={<FileText size={18} className="text-blue-500"/>} />
        <KPICard title="PENDING" value={pendingCount} icon={<AlertCircle size={18} className="text-red-500"/>} />
        <KPICard title="IN PROGRESS" value={inProgressCount} icon={<Clock size={18} className="text-yellow-500"/>} />
        <KPICard title="RESOLVED" value={resolvedCount} icon={<CheckCircle2 size={18} className="text-green-500"/>} />
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-64">
          <h3 className="font-bold text-slate-800 mb-6">Complaint Trend Canvas</h3>
          <div className="flex-1 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 text-slate-400 text-sm italic">
            Visualization Rendering Area
          </div>
        </div>
      </div>
    </div>
  );
}

//
// ==========================================
// 4. LIVE MAP VIEW
// ==========================================
function LiveMapView({ reports }) {
  const ktmPosition = [27.7172, 85.3240]; // Kathmandu Center

  return (
    <div className="flex min-h-[calc(100vh-140px)] lg:h-[calc(100vh-140px)] flex-col lg:flex-row bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden w-full max-w-none animate-in fade-in duration-300">
      {/* Map Sidebar */}
      <div className="w-full lg:w-80 border-r-0 lg:border-r border-slate-100 p-5 sm:p-6 flex flex-col bg-white z-[10] shrink-0">
        <h3 className="text-sm font-black text-slate-800 flex items-center mb-6 uppercase tracking-wider">
          <MapIcon size={16} className="mr-2 text-blue-600" /> Active Incidents
        </h3>
        <div className="space-y-3 overflow-y-auto pr-2">
          {reports.filter(r => r.latitude).map((report) => (
            <div key={report._id} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs font-black text-blue-600 mb-1 uppercase">HA-{report._id.slice(-4)}</p>
              <p className="text-sm font-bold text-slate-800 truncate">{report.category}</p>
              <p className="text-[10px] font-bold text-slate-400 truncate">{report.location}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Actual Map */}
      <div className="flex-1 relative z-0">
        <MapContainer center={ktmPosition} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {reports.map((report) => (
            report.latitude && (
              <Marker key={report._id} position={[report.latitude, report.longitude]}>
                <Popup>
                  <div className="p-1">
                    <h4 className="font-bold text-slate-800">{report.category}</h4>
                    <p className="text-xs text-slate-600">{report.description}</p>
                    <p className="text-[10px] mt-2 font-bold text-blue-600 uppercase">{report.status || 'New'}</p>
                  </div>
                </Popup>
              </Marker>
            )
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

//
function AnalyticsView({ reports }) {
  // 🛡️ GUARD RAIL: If reports are still loading, show a loading state instead of crashing
  if (!reports || reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200 animate-pulse">
        <div className="w-12 h-12 bg-slate-200 rounded-full mb-4"></div>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Awaiting Database Connection...</p>
      </div>
    );
  }

  // 1. DATA PROCESSING
  const processPieData = () => {
    const counts = {};
    reports.forEach((r) => (counts[r.category] = (counts[r.category] || 0) + 1));
    return Object.keys(counts).map((cat) => ({ name: cat, value: counts[cat] }));
  };

  const processWardData = () => {
    const counts = {};
    reports.forEach((r) => {
      const wardName = r.ward || "General";
      counts[wardName] = (counts[wardName] || 0) + 1;
    });
    return Object.keys(counts)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((ward) => ({ name: ward, Complaints: counts[ward] }));
  };

  const pieData = processPieData();
  const wardData = processWardData();
  const COLORS = ["#2563eb", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"];

  // 2. SUMMARY LOGIC
  const topCategory = pieData.length > 0 ? pieData.sort((a, b) => b.value - a.value)[0].name : "N/A";
  const mostActiveWard = wardData.length > 0 ? wardData.sort((a, b) => b.Complaints - a.Complaints)[0].name : "N/A";

  return (
    <div className="space-y-8 sm:space-y-10 animate-in fade-in duration-500 w-full max-w-none pb-12">
      
      {/* KPI HERO SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Main Issue</p>
          <p className="text-2xl font-black text-blue-600">{topCategory}</p>
        </div>
        <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Priority Ward</p>
          <p className="text-2xl font-black text-red-600">{mostActiveWard}</p>
        </div>
        <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Resolution</p>
          <p className="text-2xl font-black text-green-600">2.1 Days</p>
        </div>
      </div>

      {/* DONUT CHART */}
      <div className="bg-white p-5 sm:p-8 lg:p-10 rounded-[32px] border border-slate-100 shadow-sm h-[420px] sm:h-[500px] flex flex-col">
        <h3 className="font-extrabold text-slate-800 text-xl mb-8">Category Distribution</h3>
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} innerRadius={80} outerRadius={130} paddingAngle={5} dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="none" />
                ))}
                <Label value={`${reports.length} Total`} position="center" className="font-black fill-slate-800 text-xl" />
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Legend iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* BAR CHART */}
      <div className="bg-white p-5 sm:p-8 lg:p-10 rounded-[32px] border border-slate-100 shadow-sm h-[420px] sm:h-[500px] flex flex-col">
        <h3 className="font-extrabold text-slate-800 text-xl mb-8">Ward-wise Analysis</h3>
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={wardData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#64748b' }} allowDecimals={false} />
              <Tooltip cursor={{ fill: "#f8fafc" }} contentStyle={{ borderRadius: '16px', border: 'none' }} />
              <Bar dataKey="Complaints" fill="#2563eb" radius={[10, 10, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>

        </div>
      </div>
    </div>
  );
}
// ==========================================
// UPDATED SETTINGS VIEW WITH OFFICER MANAGEMENT
// ==========================================
function SettingsView() {
  const [officers, setOfficers] = useState([
    { id: 1, name: "Ram Bahadur", ward: "Ward 10", phone: "9841234567", email: "ram@hamroawaaz.gov.np" },
    { id: 2, name: "Sunita Rai", ward: "Ward 17", phone: "9851012345", email: "sunita@hamroawaaz.gov.np" }
  ]);
  
  const [newOfficer, setNewOfficer] = useState({ name: "", ward: "", phone: "", email: "" });

  // Handle adding a new officer to the local state
  const handleAddOfficer = (e) => {
    e.preventDefault();
    if (!newOfficer.name || !newOfficer.ward || !newOfficer.phone) {
      alert("Please fill in the Name, Ward, and Phone number.");
      return;
    }
    
    const officerToAdd = {
      ...newOfficer,
      id: Date.now(), // Unique ID for React rendering
    };

    setOfficers([...officers, officerToAdd]);
    setNewOfficer({ name: "", ward: "", phone: "", email: "" });
    alert(`Success: ${newOfficer.name} has been registered as a Field Officer.`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 px-0 sm:px-0">
      
      {/* 1. PROFILE INFORMATION SECTION */}
      <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
        <h3 className="text-lg font-black text-slate-800 mb-8 tracking-tight">Profile Information</h3>
        
        {/* Profile Header Card */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-10 pb-8 border-b border-slate-50">
          <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-[24px] flex items-center justify-center font-black text-2xl shadow-inner">AS</div>
          <div>
            <p className="text-xl font-black text-slate-800">Admin Supervisor</p>
            <p className="text-sm font-bold text-slate-400">admin@hamroawaaz.gov.np</p>
            <button className="text-blue-600 text-[10px] font-black uppercase tracking-widest mt-2 hover:underline">Change profile photo</button>
          </div>
        </div>

        {/* Profile Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
            <input type="text" defaultValue="Admin Supervisor" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500/10 outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Department</label>
            <input type="text" defaultValue="Municipal Office" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500/10 outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ward Coverage</label>
            <input type="text" defaultValue="All Wards" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500/10 outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
            <input type="text" defaultValue="+977 01-XXXXXXX" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500/10 outline-none transition-all" />
          </div>
        </div>
      </div>

      {/* 2. ADD OFFICER & MANAGEMENT SECTION */}
      <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Users className="text-blue-600" size={20} />
          </div>
          <h3 className="text-lg font-black text-slate-800 tracking-tight">Field Officer Management</h3>
        </div>

        {/* Inline Add Officer Form */}
        <form onSubmit={handleAddOfficer} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-10 p-5 sm:p-6 bg-slate-50 rounded-[24px] border border-slate-100">
          <div className="col-span-1">
            <input 
              placeholder="Officer Name" 
              value={newOfficer.name}
              onChange={(e) => setNewOfficer({...newOfficer, name: e.target.value})}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20" 
            />
          </div>
          <div className="col-span-1">
            <input 
              placeholder="Ward (e.g. Ward 7)" 
              value={newOfficer.ward}
              onChange={(e) => setNewOfficer({...newOfficer, ward: e.target.value})}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20" 
            />
          </div>
          <div className="col-span-1">
            <input 
              placeholder="Phone Number" 
              value={newOfficer.phone}
              onChange={(e) => setNewOfficer({...newOfficer, phone: e.target.value})}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20" 
            />
          </div>
          <div className="col-span-1">
            <input 
              placeholder="Email Address" 
              value={newOfficer.email}
              onChange={(e) => setNewOfficer({...newOfficer, email: e.target.value})}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20" 
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 h-12 sm:h-auto">
            <Zap size={14} /> Add Officer
          </button>
        </form>

        {/* Registered Officers List */}
        <div className="space-y-3">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-4">Registered Personnel</p>
          {officers.map(off => (
            <div key={off.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border border-slate-100 bg-white rounded-2xl hover:border-blue-200 transition-all group">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-blue-600 font-bold text-sm group-hover:bg-blue-50 transition-colors">
                  {off.name.charAt(0)}
                </div>
                <div>
                  <p className="text-[15px] font-bold text-slate-800">{off.name}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mt-0.5">Assigned to {off.ward}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 self-end sm:self-auto">
                {/* WhatsApp Link Integration */}
                <a 
                  href={`https://wa.me/977${off.phone.replace(/[^0-9]/g, '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2.5 text-slate-400 hover:text-green-500 bg-slate-50 rounded-lg hover:bg-green-50 transition-all"
                  title="Contact via WhatsApp"
                >
                  <Mail size={18}/>
                </a>
                <button 
                  onClick={() => setOfficers(officers.filter(o => o.id !== off.id))}
                  className="p-2.5 text-slate-400 hover:text-red-500 bg-slate-50 rounded-lg hover:bg-red-50 transition-all"
                >
                  <Trash2 size={18}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
// ==========================================
// MICRO-COMPONENTS 
// ==========================================
function SidebarItem({ to, icon: Icon, label, active, badge }) { return (<Link to={to} className={`flex items-center px-4 py-3.5 rounded-xl transition-all font-semibold text-[14px] ${active ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-[#253047] hover:text-white"}`}><Icon size={18} className={`mr-4 ${active ? 'text-white' : 'text-slate-500'}`} /><span className="truncate">{label}</span>{badge && <span className="ml-auto bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{badge}</span>}</Link>); }
function KPICard({ title, value, icon }) { return (<div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col"><div className="flex justify-between items-start mb-2"><p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{title}</p><div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">{icon}</div></div><p className="text-3xl sm:text-4xl font-black text-slate-800 mb-2">{value}</p></div>); }
function OfficerCard({ name, w, cases, load, rating, avail, aColor, barColor="bg-blue-600" }) { return (<div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm"><div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4"><div className="flex gap-4 min-w-0"><div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-100 shrink-0">RB</div><div className="min-w-0"><p className="font-bold text-slate-800 truncate">{name}</p><p className="text-xs text-slate-500 truncate">{w}</p></div></div><span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${aColor} self-start`}>{avail}</span></div><div className="flex justify-between text-xs font-bold text-slate-600 mb-2 gap-3"><span>{cases} active cases</span><span className="text-amber-500 text-sm">⭐ {rating}</span></div><div className="w-full bg-slate-100 rounded-full h-1.5"><div className={`${barColor} h-1.5 rounded-full`} style={{ width: `${load}%` }}></div></div></div>); }