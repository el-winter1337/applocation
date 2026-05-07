import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet icon markers
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function LiveMapView({ reports }) {
  // Center of Kathmandu
  const center = [27.7172, 85.3240];

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-slate-800">Live Map View</h2>
        <p className="text-slate-500 text-sm">Geospatial Intelligence • Ward 1-32 Live View</p>
      </div>

      <div className="flex-1 rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative">
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          {reports.map((report) => (
            // Note: This assumes your backend sends lat/lon. 
            // If only address is sent, you'll need to geocode it here.
            report.latitude && (
              <Marker key={report._id} position={[report.latitude, report.longitude]}>
                <Popup>
                  <div className="p-2">
                    <h4 className="font-bold border-b mb-1">{report.category}</h4>
                    <p className="text-xs text-slate-600">{report.location}</p>
                    <span className="text-[10px] font-bold uppercase text-orange-600">{report.status}</span>
                  </div>
                </Popup>
              </Marker>
            )
          ))}
        </MapContainer>
        
        {/* Map Filters Overlay */}
        <div className="absolute top-4 left-4 z-[1000] bg-white p-4 rounded-xl shadow-xl border border-slate-200 w-48">
          <h4 className="text-xs font-black text-slate-400 mb-3 tracking-widest uppercase">Map Filters</h4>
          <div className="space-y-2">
            <FilterOption label="All Statuses" color="bg-blue-500" />
            <FilterOption label="New" color="bg-red-500" />
            <FilterOption label="In Progress" color="bg-orange-500" />
            <FilterOption label="Resolved" color="bg-green-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterOption({ label, color }) {
  return (
    <div className="flex items-center space-x-2 cursor-pointer hover:bg-slate-50 p-1 rounded">
      <div className={`w-2 h-2 rounded-full ${color}`}></div>
      <span className="text-xs font-bold text-slate-700">{label}</span>
    </div>
  );
}
