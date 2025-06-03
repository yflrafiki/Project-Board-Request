// src/Components/Sidebar.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSettings, FiTag, FiLogOut, FiMenu } from "react-icons/fi";

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    setCurrentUser(user);
  }, []);

  const switchAccount = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-md shadow"
      >
        <FiMenu />
      </button>

      {/* Sidebar Container */}
      <aside
        className={`bg-white w-64 fixed top-0 left-0 h-full shadow-lg transition-transform duration-300 z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-5 border-b border-gray-200">
            <h2 className="text-lg font-bold text-blue-600">Orcta</h2>
            {currentUser && (
              <p className="text-sm text-gray-500">Hello, {currentUser.name}</p>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-4 text-sm text-gray-700">
            <Link to="/dashboard" className="block hover:text-blue-600">🏠 Dashboard</Link>
            <Link to="/tags" className="block hover:text-blue-600 flex items-center gap-2">
              <FiTag /> Tags
            </Link>
            <button
              onClick={switchAccount}
              className="w-full text-left hover:text-blue-600 flex items-center gap-2"
            >
              <FiSettings /> Switch Account
            </button>
            <button
              onClick={switchAccount}
              className="w-full text-left hover:text-red-500 flex items-center gap-2"
            >
              <FiLogOut /> Logout
            </button>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t text-xs text-gray-400 text-center">
            Orcta © {new Date().getFullYear()}
          </div>
        </div>
      </aside>
    </>
  );
};
