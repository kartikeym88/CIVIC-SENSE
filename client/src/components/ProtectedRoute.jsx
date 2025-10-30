// client/src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute
 * - allowedRoles: array of roles allowed to access this route (e.g. ["admin"] or ["citizen"])
 * - If no token found -> redirect to /login
 * - If role is not allowed -> redirect to home (/)
 *
 * NOTE: This uses localStorage token & userRole for quick client-side protection.
 * For strong protection, backend endpoints should also verify the token & role.
 */
export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles specified and user's role isn't included -> redirect
  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    if (!role || !allowedRoles.includes(role)) {
      return <Navigate to="/" replace />;
    }
  }

  // OK
  return children;
}
