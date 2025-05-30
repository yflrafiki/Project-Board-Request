// components/Sidebar.tsx
import React from "react";

export const Sidebar = () => {
  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-blue-600 text-white shadow-lg hidden md:block z-40">
      <div className="p-6">
        <h2 className="text-2xl font-bold">Orcta</h2>
        <p className="text-sm text-blue-100">Project Requests</p>
      </div>
      <nav className="mt-10 space-y-4 px-6">
        <div className="text-white font-semibold">Dashboard</div>
        <div className="text-blue-100 hover:text-white cursor-pointer">Requests</div>
        <div className="text-blue-100 hover:text-white cursor-pointer">Admin Panel</div>
      </nav>
    </aside>
  );
};
