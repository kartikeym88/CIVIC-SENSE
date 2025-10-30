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
import { Toaster } from "react-hot-toast";


import ProtectedRoute from "./components/ProtectedRoute";


import { getAuth, onAuthStateChanged } from "firebase/auth";
import { setAuthToken } from "./api";

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(localStorage.getItem("userRole") || null);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);




  useEffect(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, async (u) => {
    if (u) {
      const token = await u.getIdToken();
      setAuthToken(token);
      setUser(u);

      // 🟢 Sync user role from localStorage if available
      const savedRole = localStorage.getItem("userRole");
      if (savedRole) setRole(savedRole);
    } else {
      setAuthToken(null);
      setUser(null);
      setRole(null);
    }
  setAuthLoading(false);
  });
  


  // 🟣 Listen for role changes in localStorage (cross-tab sync)
  const handleStorageChange = () => {
    const updatedRole = localStorage.getItem("userRole");
    setRole(updatedRole);
  };
  window.addEventListener("storage", handleStorageChange);

  return () => window.removeEventListener("storage", handleStorageChange);
}, []);
if (authLoading) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="animate-spin h-10 w-10 border-t-4 border-blue-600 rounded-full"></div>
      <p className="ml-3 text-gray-700 font-medium">Loading Civic-Sense...</p>
    </div>
  );
}


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 text-gray-800">
    
      {/* ✅ Navbar */}
      <nav className="backdrop-blur-md bg-white/70 border-b border-gray-200 shadow-sm sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
    {/* 🔹 Brand */}
    <Link
      to="/"
      className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
    >
      Civic-Sense
    </Link>

    {/* 🔹 Navigation & User */}
    <div className="flex items-center space-x-4">
      {/* Role-based navigation */}
      {role === "admin" && (
        <Link
          to="/admin"
          className="text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors"
        >
          Dashboard
        </Link>
      )}
      {role === "citizen" && (
        <Link
          to="/create"
          className="text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors"
        >
          Create Complaint
        </Link>
      )}

      {/* Auth buttons */}
      {!user ? (
        <>
          <Link
            to="/login"
            className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-4 py-1.5 text-sm border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
          >
            Signup
          </Link>
        </>
      ) : (
        <>
          {/* Role badge */}
          {role && (
  <span
    className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all duration-300 transform ${
      role === "admin"
        ? "bg-indigo-100 text-indigo-700 border-indigo-300 scale-105"
        : "bg-green-100 text-green-700 border-green-300 scale-105"
    }`}
  >
    👤 {role.toUpperCase()}
  </span>
)}

          <Link
            to="/logout"
            className="px-4 py-1.5 text-sm bg-red-50 border border-red-300 text-red-600 rounded-lg hover:bg-red-100 transition"
          >
            Logout
          </Link>
        </>
      )}
    </div>
  </div>
</nav>




      {/* ✅ Main routes */}
      <main className="p-6 max-w-7xl mx-auto">

        <Routes>
  {/* Public routes */}
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/logout" element={<Logout />} />
  <Route path="/posts/:id" element={<PostDetails />} />

  {/* Citizen-only: create post */}
  <Route
    path="/create"
    element={
      <ProtectedRoute allowedRoles={["citizen"]}>
        <CreatePost />
      </ProtectedRoute>
    }
  />

  {/* Admin-only dashboard */}
  <Route
    path="/admin"
    element={
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminDashboard />
      </ProtectedRoute>
    }
  />
</Routes>

      </main>
      
      <Chatbot />
{loading && <Loader text="Please wait..." />}

{/* ✅ Global toast notifications */}
<Toaster
  position="top-right"
  toastOptions={{
    style: {
      background: "#fff",
      border: "1px solid #e5e7eb",
      color: "#111827",
      fontWeight: 500,
      borderRadius: "0.5rem",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
    success: { iconTheme: { primary: "#2563eb", secondary: "#fff" } },
    error: { iconTheme: { primary: "#dc2626", secondary: "#fff" } },
  }}
/>
</div>

  );
}
