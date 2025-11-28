import React, { useEffect, useState } from "react";
import { api } from "../api";
import { CheckCircle, Trash2, Image as ImageIcon } from "lucide-react";

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await api.get("/posts");
      setComplaints(res.data);
    } catch (err) {
      console.error("❌ Error fetching complaints:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id) => {
    try {
      console.log("🆔 Marking resolved:", id);
      const res = await api.put(`/posts/${id}/status`);
      setComplaints((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, status: res.data.status } : c
        )
      );
    } catch (err) {
      console.error("❌ Error marking resolved:", err.response?.data || err.message);
      alert("Failed to mark as resolved. Check console for details.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;
    try {
      console.log("🗑️ Deleting:", id);
      await api.delete(`/posts/${id}`);
      setComplaints((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("❌ Error deleting complaint:", err.response?.data || err.message);
      alert("Failed to delete. Check console for details.");
    }
  };

  if (loading)
    return <p className="text-center text-gray-500 mt-10">Loading complaints...</p>;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">🏛️ Manage Complaints</h2>

      {complaints.length === 0 ? (
        <p className="text-gray-500 text-center">No complaints found.</p>
      ) : (
        <div className="grid gap-6">
          {complaints.map((c) => (
            <div
              key={c._id}
              className={`p-6 rounded-2xl border shadow-md bg-white transition hover:shadow-lg ${
                c.status === "Resolved"
                  ? "border-green-400"
                  : "border-yellow-300"
              }`}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">{c.title}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    c.status === "Resolved"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {c.status}
                </span>
              </div>

              <p className="text-gray-600 mt-2">{c.description}</p>
              <p className="text-sm text-gray-500 mt-1">
                <b>Category:</b> {c.category}
              </p>

              {c.location?.text && (
                <p className="text-sm text-gray-500 mt-1">📍 {c.location.text}</p>
              )}

              {c.imageUrl && (
                <div className="mt-3">
                  <img
                    src={c.imageUrl}
                    alt="Complaint"
                    className="w-full rounded-xl border h-60 object-cover shadow-sm"
                  />
                  <a
                    href={c.imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 text-sm mt-2 inline-flex items-center gap-1 hover:underline"
                  >
                    <ImageIcon size={16} /> View Full Image
                  </a>
                </div>
              )}

              <div className="flex gap-3 mt-5">
                {c.status !== "Resolved" && (
                  <button
                    onClick={() => handleResolve(c._id)}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    <CheckCircle size={16} /> Mark as Resolved
                  </button>
                )}
                <button
                  onClick={() => handleDelete(c._id)}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
