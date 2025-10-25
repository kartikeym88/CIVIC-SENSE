import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CreatePost from "./pages/CreatePost";
import PostDetails from "./pages/PostDetails";
import AdminDashboard from "./pages/AdminDashboard";
import Chatbot from "./components/Chatbot";
import Signup from "./pages/Signup";
import Logout from "./pages/Logout";
import "leaflet/dist/leaflet.css";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { setAuthToken } from "./api";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (u) => {
      if (u) {
        const token = await u.getIdToken();
        setAuthToken(token);
        setUser(u);
      } else {
        setAuthToken(null);
        setUser(null);
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ Navbar */}
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <Link to="/" className="font-bold text-xl">Civic-Bridge</Link>
        <div className="space-x-4">
          <Link to="/create" className="px-3 py-1 border rounded">Create</Link>
          <Link to="/admin" className="px-3 py-1 border rounded">Dashboard</Link>

          {/* ✅ Conditional buttons */}
          {!user ? (
            <>
              <Link to="/login" className="px-3 py-1 border rounded">Login</Link>
              <Link to="/signup" className="px-3 py-1 border rounded">Signup</Link>
            </>
          ) : (
            <Link
              to="/logout"
              className="px-3 py-1 border rounded text-red-600 hover:bg-red-100"
            >
              Logout
            </Link>
          )}
        </div>
      </nav>

      {/* ✅ Main routes */}
      <main className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>

      <Chatbot />
    </div>
  );
}
