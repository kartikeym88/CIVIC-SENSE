import React, { useEffect, useState } from "react";
import { api } from "../api";
import { Link } from "react-router-dom";

export default function UserDashboard() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get("/posts")
      .then((res) => setPosts(res.data))
      .catch((err) => console.error("Error loading complaints:", err));
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">
        🧍 My Complaints
      </h1>

      {posts.length === 0 ? (
        <p className="text-gray-500 text-center">No complaints yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map((p) => (
            <div
              key={p._id}
              className="p-4 bg-white rounded-lg shadow hover:shadow-md transition"
            >
              <h2 className="font-semibold text-lg">{p.title}</h2>
              <p className="text-gray-600">{p.description}</p>
              <p className="text-sm text-gray-400">
                {p.status} • {new Date(p.createdAt).toLocaleDateString()}
              </p>
              <Link
                to={`/posts/${p._id}`}
                className="text-blue-600 hover:underline text-sm"
              >
                View details →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
