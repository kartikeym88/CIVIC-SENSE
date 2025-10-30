import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../components/Loader";


export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("citizen"); // 🟢 new
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);


  const handleSignup = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    // 1️⃣ Create user in Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2️⃣ Get Firebase token
    const idToken = await user.getIdToken();

    // 3️⃣ Save to your backend MongoDB
    await api.post("/users/register", {
      uid: user.uid,
      name: name || user.email.split("@")[0],
      email: user.email,
      role, // citizen or admin
    });

    // 4️⃣ Store role + token locally
    localStorage.setItem("token", idToken);
    localStorage.setItem("userRole", role);
    window.dispatchEvent(new Event("storage"));

    toast.success("Account created successfully!");

    // 5️⃣ Redirect based on role
    setTimeout(() => {
      if (role === "admin") navigate("/admin-dashboard");
      else navigate("/dashboard");
    }, 1200);
  } catch (err) {
    console.error(err);
    toast.error(err.message || "Signup failed!");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      {loading && <Loader text="Creating your account..." />}

      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded-lg shadow-md w-80"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Create Account</h2>
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-2 rounded mb-4 text-sm">{success}</div>}

        {/* 🧍 Name */}
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
          required
        />

        {/* 📧 Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
          required
        />

        {/* 🔐 Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
          required
        />

        {/* 🧩 Role Selector */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
        >
          <option value="citizen">Citizen</option>
          <option value="admin">Admin</option>
        </select>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Sign Up
        </button>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 cursor-pointer"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
