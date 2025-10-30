import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalImage, setModalImage] = useState(null); // 🟢 for modal image
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    const fetchPosts = async () => {
      try {
        const res = await api.get("/posts");
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <p className="text-center mt-6">Loading recent concerns...</p>;
  if (error) return <p className="text-center text-red-600 mt-6">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 relative">
      <h1 className="text-2xl font-bold mb-4">Recent Concerns</h1>
      {posts.length === 0 ? (
        <p className="text-gray-500 text-center">No posts yet.</p>
      ) : (
        <div className="grid gap-4">
          {posts.map((p) => (
            <div
              key={p._id}
              className="bg-white p-4 rounded shadow hover:shadow-md transition"
            >
              <div className="flex justify-between">
                <div>
                  <h2 className="font-semibold text-lg">{p.title}</h2>
                  <p className="text-sm text-gray-600">
                    {p.userName || "Anonymous"} •{" "}
                    {new Date(p.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm">{p.supports?.length || 0} supports</p>
                  <Link
                    to={`/posts/${p._id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                </div>
              </div>

              {/* 🖼️ Image Section */}
              {p.imageUrl && (
                <div className="mt-3">
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    className="w-full h-56 object-cover rounded-lg mb-3 cursor-pointer hover:opacity-90 transition"
                    onClick={() => setModalImage(p.imageUrl)} // 🟢 open modal
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>
              )}

              <p className="text-gray-700">{p.description?.slice(0, 200)}</p>

              {p.location?.text && (
                <p className="mt-2 text-sm text-gray-500">
                  📍 {p.location.text}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 🟢 Global Image Modal */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[9999]"
          onClick={() => setModalImage(null)}
        >
          <div className="relative max-w-4xl w-full mx-4">
            <img
              src={modalImage}
              alt="Complaint"
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
