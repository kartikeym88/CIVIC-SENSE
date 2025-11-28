import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { api } from "../api";
import "leaflet/dist/leaflet.css";

// ✅ Custom map icons
const pendingIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
  iconSize: [30, 30],
});

const resolvedIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/190/1904117.png",
  iconSize: [30, 30],
});

export default function AdminMap() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch complaints
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/posts");
        setComplaints(res.data);
      } catch (err) {
        console.error("Error loading complaints:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return <p className="text-center mt-6 text-gray-500">Loading map...</p>;

  // ✅ Calculate average center
  const avgLat =
    complaints.reduce((sum, c) => sum + (c.location?.lat || 0), 0) /
    (complaints.length || 1);
  const avgLng =
    complaints.reduce((sum, c) => sum + (c.location?.lng || 0), 0) /
    (complaints.length || 1);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">
        Complaints Map Overview
      </h1>

      {complaints.length === 0 ? (
        <p className="text-center text-gray-500">No complaints found</p>
      ) : (
        <div className="rounded-xl overflow-hidden shadow-md border h-[75vh]">
          <MapContainer
            center={[avgLat || 20.5937, avgLng || 78.9629]} // fallback: India center
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {complaints.map((c) => (
              c.location && c.location.lat && c.location.lng ? (
                <Marker
                  key={c._id}
                  position={[c.location.lat, c.location.lng]}
                  icon={c.status === "Resolved" ? resolvedIcon : pendingIcon}
                >
                  <Popup>
                    <div className="text-sm">
                      <strong>{c.title}</strong>
                      <p className="text-gray-600">{c.description}</p>
                      <p className="text-xs text-gray-400">
                        {c.status} • {new Date(c.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ) : null
            ))}
          </MapContainer>
        </div>
      )}
    </div>
  );
}
