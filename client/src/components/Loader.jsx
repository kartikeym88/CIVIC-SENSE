import React from "react";

export default function Loader({ text = "Loading..." }) {
  return (
    <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-solid mb-4"></div>
      <p className="text-gray-700 font-medium">{text}</p>
    </div>
  );
}
