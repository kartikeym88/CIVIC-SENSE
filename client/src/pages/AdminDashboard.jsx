/*import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function AdminDashboard(){
  const [posts, setPosts] = useState([]);

  useEffect(()=> { api.get('/posts').then(r=>setPosts(r.data)).catch(console.error); }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Admin / Officials Dashboard</h2>
      <div className="grid gap-3">
        {posts.map(p => (
          <div key={p._id} className="bg-white p-3 rounded shadow flex justify-between">
            <div>
              <h3 className="font-semibold">{p.title}</h3>
              <p className="text-sm text-gray-600">{p.userName} • {new Date(p.createdAt).toLocaleString()}</p>
            </div>
            <div className="text-sm">{p.supports?.length || 0} supports</div>
          </div>
        ))}
      </div>
    </div>
  );
}
*/
import React, { useEffect, useState } from "react";
import { api } from "../api";
import MapView from "../components/MapView";

export default function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [modalImage, setModalImage] = useState(null); // 🟢 For fullscreen image modal


  // ✅ Fetch all posts
  const fetchPosts = async () => {
    try {
      const res = await api.get("/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // ✅ Delete post
  const deletePost = async (id) => {
    if (!window.confirm("Delete this complaint?")) return;
    try {
      await api.delete(`/posts/${id}`);
      setPosts(posts.filter((p) => p._id !== id));
      alert("Deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete complaint");
    }
  };

  // ✅ Toggle complaint status
  const toggleStatus = async (id) => {
  console.log("🟢 ToggleStatus clicked for:", id);
  try {
    const res = await api.put(`/posts/${id}/status`);
    console.log("✅ Response:", res.data);

    setPosts(posts.map(p => 
      p._id === id ? { ...p, status: res.data.status } : p
    ));
  } catch (err) {
    console.error("❌ Error updating status:", err.response?.data || err.message);
    alert("Failed to update status");
  }
};


  // ✅ Filters
  const filteredPosts = posts.filter((post) => {
    const matchCategory =
      filterCategory === "All" || post.category === filterCategory;
    const matchStatus =
      filterStatus === "All" || post.status === filterStatus;
    return matchCategory && matchStatus;
  });

  const total = posts.length;
  const resolved = posts.filter((p) => p.status === "Resolved").length;
  const pending = posts.filter((p) => p.status === "Pending").length;

  if (loading) return <p className="text-center mt-6">Loading complaints...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6">
        Admin Dashboard
      </h2>

      {/* ✅ Map (optional, doesn’t break layout) */}
      {posts.length > 0 ? (
        <div className="mb-8">
          <MapView complaints={posts} />
        </div>
      ) : null}

      {/* ✅ Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-center">
        <div className="bg-blue-100 p-4 rounded-lg shadow">
          <h3 className="font-semibold text-lg">Total Complaints</h3>
          <p className="text-2xl font-bold">{total}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow">
          <h3 className="font-semibold text-lg">Resolved</h3>
          <p className="text-2xl font-bold">{resolved}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg shadow">
          <h3 className="font-semibold text-lg">Pending</h3>
          <p className="text-2xl font-bold">{pending}</p>
        </div>
      </div>

      {/* ✅ Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-center">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="All">All Categories</option>
          {[...new Set(posts.map((p) => p.category))].map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      {/* ✅ Complaint List */}
      {/* ✅ Complaint List */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {filteredPosts.length === 0 ? (
    <p className="text-center text-gray-500 col-span-2">
      No matching complaints found
    </p>
  ) : (
    filteredPosts.map((post) => (
      <div
        key={post._id}
        className={`p-4 rounded-xl shadow-md border ${
          post.status === "Resolved" ? "bg-green-50" : "bg-yellow-50"
        }`}
      >
        {/* 🖼️ Image Preview */}
        {post.imageUrl ? (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-48 object-cover rounded mb-3 cursor-pointer"
            onClick={() => setModalImage(post.imageUrl)}
            onError={(e) => (e.target.style.display = "none")}
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 rounded mb-3">
            No Image Uploaded
          </div>
        )}

        {/* 🧾 Complaint Info */}
        <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
        <p className="text-gray-600 mb-2">{post.description}</p>
        <p className="text-sm text-gray-500 mb-1">
          <b>Category:</b> {post.category}
        </p>
        <p className="text-sm text-gray-500 mb-1">
          <b>Location:</b>{" "}
          {post.location?.text
            ? post.location.text
            : post.location
            ? `Lat: ${post.location.lat}, Lng: ${post.location.lng}`
            : "N/A"}
        </p>
        <p className="text-sm text-gray-400 mb-2">
          Posted on {new Date(post.createdAt).toLocaleString()}
        </p>

        {/* ⚙️ Action Buttons */}
        <div className="flex justify-end gap-2">
          <button
            onClick={() => toggleStatus(post._id)}
            className={`px-3 py-1 rounded ${
              post.status === "Resolved"
                ? "bg-yellow-500 text-white hover:bg-yellow-600"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {post.status === "Resolved" ? "Mark Pending" : "Mark Resolved"}
          </button>
          <button
            onClick={() => deletePost(post._id)}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    ))
  )}
</div>
{/* 🟢 Global Image Modal */}
{modalImage && (
  <div
    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[9999]"
    onClick={() => setModalImage(null)}
  >
    <div className="relative max-w-5xl w-full mx-4">
      <img
        src={modalImage}
        alt="Full complaint view"
        className="w-full max-h-[90vh] object-contain rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      />
      <button
        onClick={() => setModalImage(null)}
        className="absolute top-3 right-3 text-white bg-black bg-opacity-50 px-3 py-1 rounded hover:bg-opacity-70 transition"
      >
        ✕ Close
      </button>
    </div>
  </div>
)}


    </div>
  );
}
