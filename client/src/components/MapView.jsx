import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Default icon fix for Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function MapView({ complaints = [] }) {
  if (!complaints.length)
    return <p className="text-center text-gray-500">No locations to show</p>;

  // Center map roughly on the first complaint
  const first = complaints[0];
  const center = [
    first?.location?.lat || 20.5937, // default India coords
    first?.location?.lng || 78.9629,
  ];

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden mb-6">
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {complaints.map((p) =>
          p.location?.lat && p.location?.lng ? (
            <Marker
              key={p._id}
              position={[p.location.lat, p.location.lng]}
              icon={
                new L.Icon({
                  iconUrl:
                    p.status === "Resolved"
                      ? "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
                      : "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                })
              }
            >
              <Popup>
                <b>{p.title}</b> <br />
                {p.category} <br />
                Status: {p.status}
              </Popup>
            </Marker>
          ) : null
        )}
      </MapContainer>
    </div>
  );
}
