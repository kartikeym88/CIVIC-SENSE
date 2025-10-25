/*import React, { useState, useEffect } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [location, setLocation] = useState({ lat: null, lng: null, text: "" });
  const [autoDetected, setAutoDetected] = useState(false);
  const navigate = useNavigate();

  // ✅ Try auto-detect user location when page loads
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation({
            lat: latitude,
            lng: longitude,
            text: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`,
          });
          setAutoDetected(true);
        },
        (err) => console.warn("⚠️ Location access denied:", err.message)
      );
    }
  }, []);

  // ✅ Handle manual map click
  const LocationSelector = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setLocation({
          lat,
          lng,
          text: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`,
        });
        setAutoDetected(false);
      },
    });
    return location.lat && location.lng ? (
      <Marker position={[location.lat, location.lng]} />
    ) : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const post = {
        title,
        description,
        category,
        imageUrl,
        location,
      };

      await api.post("/posts", post);
      alert("✅ Complaint logged successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err.response?.data || err.message || err);
      alert("Error logging complaint: " + (err.response?.data?.message || err.message));
    }
  };

  // Default map center (India)
  const defaultCenter = location.lat && location.lng ? [location.lat, location.lng] : [20.5937, 78.9629];

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-md mt-6">
      <h2 className="text-xl font-bold mb-4">Log a Complaint</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="border p-2 rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="border p-2 rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />

        
        <div>
          <label className="block mb-2 font-semibold">Select Location:</label>

          
          <div className="h-64 w-full rounded-lg overflow-hidden mb-2">
            <MapContainer center={defaultCenter} zoom={autoDetected ? 13 : 5} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationSelector />
            </MapContainer>
          </div>

          
          <div className="flex items-center gap-2">
            <input
              className="border p-2 rounded w-full"
              placeholder="Location (auto or manual)"
              value={location.text}
              readOnly
            />
            <button
              type="button"
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    (pos) => {
                      const { latitude, longitude } = pos.coords;
                      setLocation({
                        lat: latitude,
                        lng: longitude,
                        text: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`,
                      });
                      setAutoDetected(true);
                      alert("📍 Location auto-detected successfully!");
                    },
                    (err) => alert("❌ Failed to get location: " + err.message)
                  );
                } else {
                  alert("Geolocation is not supported by your browser.");
                }
              }}
            >
              Use My Location
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit Complaint
        </button>
      </form>
    </div>
  );
}
*/
import React, { useState, useEffect } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [location, setLocation] = useState({ lat: null, lng: null, text: "" });
  const [autoDetected, setAutoDetected] = useState(false);
  const [fetchingAddress, setFetchingAddress] = useState(false);
  const navigate = useNavigate();

  // ✅ Function to fetch address using reverse geocoding
  const fetchAddress = async (lat, lng) => {
    try {
      setFetchingAddress(true);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      const address = data.display_name || `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
      setLocation({ lat, lng, text: address });
    } catch (err) {
      console.error("❌ Reverse geocoding failed:", err);
      setLocation({ lat, lng, text: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}` });
    } finally {
      setFetchingAddress(false);
    }
  };

  // ✅ Auto-detect location on load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setAutoDetected(true);
          fetchAddress(latitude, longitude);
        },
        (err) => console.warn("⚠️ Geolocation denied:", err.message)
      );
    }
  }, []);

  // ✅ Handle manual map click
  const LocationSelector = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setAutoDetected(false);
        fetchAddress(lat, lng);
      },
    });
    return location.lat && location.lng ? (
      <Marker position={[location.lat, location.lng]} />
    ) : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const post = {
        title,
        description,
        category,
        imageUrl,
        location,
      };
      await api.post("/posts", post);
      alert("✅ Complaint logged successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err.response?.data || err.message || err);
      alert("Error logging complaint: " + (err.response?.data?.message || err.message));
    }
  };

  const defaultCenter = location.lat && location.lng ? [location.lat, location.lng] : [20.5937, 78.9629];

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-md mt-6">
      <h2 className="text-xl font-bold mb-4">Log a Complaint</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="border p-2 rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="border p-2 rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />

        {/* 📍 Location Picker */}
        <div>
          <label className="block mb-2 font-semibold">Select or Auto-detect Location:</label>

          {/* 🗺️ Map */}
          <div className="h-64 w-full rounded-lg overflow-hidden mb-2">
            <MapContainer center={defaultCenter} zoom={autoDetected ? 13 : 5} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationSelector />
            </MapContainer>
          </div>

          {/* 🗨️ Location Info */}
          <div className="flex items-center gap-2">
            <input
              className="border p-2 rounded w-full"
              placeholder="Fetching location..."
              value={
                fetchingAddress
                  ? "Getting address..."
                  : location.text || "Click map or use auto-detect"
              }
              readOnly
            />
            <button
              type="button"
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    (pos) => {
                      const { latitude, longitude } = pos.coords;
                      setAutoDetected(true);
                      fetchAddress(latitude, longitude);
                    },
                    (err) => alert("❌ Could not access location: " + err.message)
                  );
                } else {
                  alert("Geolocation is not supported by this browser.");
                }
              }}
            >
              Use My Location
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit Complaint
        </button>
      </form>
    </div>
  );
}
