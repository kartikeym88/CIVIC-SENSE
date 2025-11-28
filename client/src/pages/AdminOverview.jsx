import React, { useEffect, useState } from "react";
import { api } from "../api";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart3, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function AdminOverview() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/posts");
        const all = res.data;
        const total = all.length;
        const resolved = all.filter((p) => p.status === "Resolved").length;
        const pending = total - resolved;

        setStats({ total, pending, resolved });
      } catch (err) {
        console.error("Error loading stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const data = [
    { name: "Resolved", value: stats.resolved },
    { name: "Pending", value: stats.pending },
  ];
  const COLORS = ["#10b981", "#facc15"];

  if (loading)
    return <p className="text-center mt-6 text-gray-500">Loading overview...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>

      {/* ✅ Stat Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-blue-100 rounded-xl p-6 flex items-center gap-4 shadow hover:shadow-md transition">
          <BarChart3 className="text-blue-700" size={40} />
          <div>
            <p className="text-gray-700 font-medium">Total Complaints</p>
            <h2 className="text-2xl font-bold">{stats.total}</h2>
          </div>
        </div>

        <div className="bg-yellow-100 rounded-xl p-6 flex items-center gap-4 shadow hover:shadow-md transition">
          <AlertTriangle className="text-yellow-700" size={40} />
          <div>
            <p className="text-gray-700 font-medium">Pending Complaints</p>
            <h2 className="text-2xl font-bold">{stats.pending}</h2>
          </div>
        </div>

        <div className="bg-green-100 rounded-xl p-6 flex items-center gap-4 shadow hover:shadow-md transition">
          <CheckCircle2 className="text-green-700" size={40} />
          <div>
            <p className="text-gray-700 font-medium">Resolved Complaints</p>
            <h2 className="text-2xl font-bold">{stats.resolved}</h2>
          </div>
        </div>
      </div>

      {/* ✅ Chart Section */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Complaint Distribution</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
