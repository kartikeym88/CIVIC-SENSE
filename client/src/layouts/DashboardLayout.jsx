import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  MapPin,
  ListTodo,
  LogOut,
} from "lucide-react";

export default function DashboardLayout() {
  const location = useLocation();

  const navItems = [
    { path: "/admin", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
    { path: "/admin/complaints", icon: <ListTodo size={18} />, label: "Complaints" },
    { path: "/admin/map", icon: <MapPin size={18} />, label: "Map View" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 bg-gradient-to-b from-blue-700 to-blue-500 text-white flex flex-col justify-between shadow-lg">
        <div>
          <div className="p-5 text-2xl font-bold tracking-wide border-b border-blue-400">
            CivicBridge Admin
          </div>

          <nav className="mt-6 space-y-2 px-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition ${
                  location.pathname === item.path
                    ? "bg-white text-blue-700 font-semibold"
                    : "hover:bg-blue-600"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-blue-400">
          <Link
            to="/logout"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-600 transition"
          >
            <LogOut size={18} />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
