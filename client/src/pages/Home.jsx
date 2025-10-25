import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetched = useRef(false); // 👈 new flag

  useEffect(() => {
    if (fetched.current) return; // prevent double fetch
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
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Recent Concerns</h1>
      {posts.length === 0 ? (
        <p className="text-gray-500 text-center">No posts yet.</p>
      ) : (
        <div className="grid gap-4">
          {posts.map((p) => (
            <div key={p._id} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between">
                <div>
                  <h2 className="font-semibold text-lg">{p.title}</h2>
                  <p className="text-sm text-gray-600">
                    {p.userName} • {new Date(p.createdAt).toLocaleString()}
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
              <p className="mt-2 text-gray-700">{p.description?.slice(0, 200)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
