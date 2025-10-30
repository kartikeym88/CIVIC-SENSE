/*import React from "react";
import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Signup successful!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Login successful!");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg w-96 space-y-4">
        <h2 className="text-2xl font-bold text-center">{isSignup ? "Sign Up" : "Login"}</h2>
        <input className="w-full p-2 rounded bg-gray-700" placeholder="Email"
          type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full p-2 rounded bg-gray-700" placeholder="Password"
          type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full bg-blue-500 p-2 rounded hover:bg-blue-600">
          {isSignup ? "Sign Up" : "Login"}
        </button>
        <p className="text-center text-sm cursor-pointer text-blue-400"
           onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? "Already have an account? Login" : "No account? Sign up"}
        </p>
      </form>
    </div>
  );
}*/
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { api, setAuthToken } from "../api";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../components/Loader";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Firebase login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2️⃣ Get fresh token
      const token = await user.getIdToken(true);

      // 3️⃣ Save token to Axios + localStorage
      localStorage.setItem("token", token);
      setAuthToken(token);

      // 4️⃣ Fetch user info from backend
      const res = await api.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const role = res.data.user.role;
      localStorage.setItem("userRole", role);
      window.dispatchEvent(new Event("storage"));


      toast.success("Welcome back!");

      setTimeout(() => {
      navigate(role === "admin" ? "/admin" : "/");
      }, 1000);



      /*// 5️⃣ Redirect based on role
      if (role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }*/
     setLoading(false);

      
    } catch (error) {
      console.error("❌ Login failed:", error);
      toast.error(error.message || "Login failed!");
      setLoading(false);

    }
    

  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow">
      <Toaster position="top-right" />
      {loading && <Loader text="Logging you in..." />}

      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          className="border p-2 rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="border p-2 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
