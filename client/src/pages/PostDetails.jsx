import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import MapView from "../components/MapView";


export default function PostDetails(){
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  

  useEffect(()=> { api.get(`/posts/${id}`).then(r=>setPost(r.data)).catch(console.error); }, [id]);

  const addComment = async () => {
    try {
      await api.post(`/posts/${id}/comment`, { text: comment });
      const r = await api.get(`/posts/${id}`); setPost(r.data); setComment("");
    } catch (err) { console.error(err); alert("Please login to comment"); }
  };

  const toggleSupport = async () => {
    try { await api.post(`/posts/${id}/support`); const r = await api.get(`/posts/${id}`); setPost(r.data); }
    catch (err) { console.error(err); alert("Please login to support"); }
  };

  if (!post) return <div>Loading...</div>;
  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold">{post.title}</h1>
      <p className="text-sm text-gray-600">
        {post.userName} • {new Date(post.createdAt).toLocaleString()}
        </p>
        <div className="my-4">
      <MapView complaints={[post]} />
    </div>
      <p className="mt-4">{post.description}</p>

      <div className="mt-4 flex gap-3">
        <button onClick={toggleSupport} className="px-3 py-1 border rounded">Support ({post.supports?.length || 0})</button>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold">Comments</h3>
        {post.comments?.map(c => (
          <div key={c._id || c.createdAt} className="border-t py-2">
            <p className="text-sm"><strong>{c.name}</strong> • {new Date(c.createdAt).toLocaleString()}</p>
            <p>{c.text}</p>
          </div>
        ))}
        <div className="mt-3">
          <textarea value={comment} onChange={(e)=>setComment(e.target.value)} className="w-full border p-2" placeholder="Add a comment" />
          <button onClick={addComment} className="mt-2 px-3 py-1 bg-blue-600 text-white rounded">Post Comment</button>
        </div>
      </div>
    </div>
  );
}
