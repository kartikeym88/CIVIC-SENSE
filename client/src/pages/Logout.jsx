import React, { useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { setAuthToken } from "../api";

export default function Logout() {
  useEffect(() => {
    const logoutUser = async () => {
      try {
        await signOut(auth); // ✅ signs out from Firebase
        localStorage.removeItem("token"); // ✅ clears stored token
        setAuthToken(null); // ✅ removes axios header
        alert("You have been logged out successfully!");
        window.location.href = "/login"; // ✅ redirect
      } catch (err) {
        console.error("❌ Logout failed:", err);
        alert("Error logging out. Please try again.");
      }
    };

    logoutUser();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-lg text-gray-600">Logging you out...</p>
    </div>
  );
}
