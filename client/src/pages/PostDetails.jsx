import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import MapView from "../components/MapView";

export default function PostDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [showImageModal, setShowImageModal] = useState(false); // 🟢 modal state

  useEffect(() => {
    api.get(`/posts/${id}`).then((r) => setPost(r.data)).catch(console.error);
  }, [id]);

  const addComment = async () => {
    try {
      await api.post(`/posts/${id}/comment`, { text: comment });
      const r = await api.get(`/posts/${id}`);
      setPost(r.data);
      setComment("");
    } catch (err) {
      console.error(err);
      alert("Please login to comment");
    }
  };

  const toggleSupport = async () => {
    try {
      await api.post(`/posts/${id}/support`);
      const r = await api.get(`/posts/${id}`);
      setPost(r.data);
    } catch (err) {
      console.error(err);
      alert("Please login to support");
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow relative">
      <h1 className="text-2xl font-bold">{post.title}</h1>
      <p className="text-sm text-gray-600 mb-3">
        {post.userName || "Anonymous"} •{" "}
        {new Date(post.createdAt).toLocaleString()}
      </p>

      {/* 🖼️ Image Preview with Modal Trigger */}
      {post.imageUrl ? (
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-64 object-cover rounded-lg mb-4 cursor-pointer hover:opacity-90 transition"
          onClick={() => setShowImageModal(true)}
          onError={(e) => (e.target.style.display = "none")}
        />
      ) : (
        <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500 rounded-lg mb-4">
          No image uploaded
        </div>
      )}

      {/* 🗺️ Map */}
      <div className="my-4">
        <MapView complaints={[post]} />
      </div>

      {/* 📝 Description */}
      <p className="mt-4 text-gray-800 leading-relaxed">{post.description}</p>

      {/* ❤️ Support Button */}
      <div className="mt-4 flex gap-3">
        <button
          onClick={toggleSupport}
          className="px-3 py-1 border rounded hover:bg-blue-100 transition"
        >
          Support ({post.supports?.length || 0})
        </button>
      </div>

      {/* 💬 Comments */}
      <div className="mt-6">
        <h3 className="font-semibold text-lg mb-2">Comments</h3>

        {post.comments?.length === 0 && (
          <p className="text-gray-500 text-sm">No comments yet.</p>
        )}

        {post.comments?.map((c) => (
          <div key={c._id || c.createdAt} className="border-t py-2">
            <p className="text-sm text-gray-700">
              <strong>{c.name || "User"}</strong> •{" "}
              {new Date(c.createdAt).toLocaleString()}
            </p>
            <p className="text-gray-800">{c.text}</p>
          </div>
        ))}

        <div className="mt-3">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Add a comment..."
          />
          <button
            onClick={addComment}
            className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Post Comment
          </button>
        </div>
      </div>

      {/* 🟢 Image Modal Overlay */}
      {showImageModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[9999]"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-4xl w-full mx-4">
            <img
              src={post.imageUrl}
              alt="Enlarged view"
              className="w-full max-h-[90vh] object-contain rounded-lg shadow-lg"
              onClick={(e) => e.stopPropagation()} // prevent closing when clicking image
            />
            <button
              onClick={() => setShowImageModal(false)}
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
