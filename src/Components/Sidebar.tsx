// src/Components/Sidebar.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiSettings, FiTag, FiLogOut, FiMenu, FiHome } from "react-icons/fi";
import { useAdminContext } from "../Contexts/AdminContext";

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { setShowAdminPrompt } = useAdminContext();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    setCurrentUser(user);
  }, [location]);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navItems = [
    { label: "Dashboard", to: "/dashboard", icon: <FiHome /> },
    { label: "Tags", to: "/tags", icon: <FiTag /> },
    { label: "Switch Account", action: () => setShowAdminPrompt(true), icon: <FiSettings /> },
    { label: "Logout", action: logout, icon: <FiLogOut /> },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-md shadow"
      >
        <FiMenu />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-40 transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
          ${isExpanded ? "w-64" : "w-20"}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b flex justify-between items-center">
            <div className="text-blue-600 font-bold text-lg">
              {isExpanded ? "Orcta" : "O"}
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="hidden lg:inline text-gray-500"
            >
              <FiMenu />
            </button>
          </div>

          {/* User Info */}
          {isExpanded && currentUser && (
            <div className="px-4 py-2 border-b text-sm text-gray-600">
              Hello, {currentUser.name}
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-2">
            {navItems.map((item, i) =>
              item.to ? (
                <Link
                  key={i}
                  to={item.to}
                  className="flex items-center gap-3 px-3 py-2 rounded text-sm hover:bg-blue-100"
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  {isExpanded && item.label}
                </Link>
              ) : (
                <button
                  key={i}
                  onClick={item.action}
                  className="flex items-center gap-3 w-full px-3 py-2 rounded text-sm text-left hover:bg-blue-100"
                >
                  {item.icon}
                  {isExpanded && item.label}
                </button>
              )
            )}
          </nav>

          {/* Footer */}
          {isExpanded && (
            <div className="text-xs text-center text-gray-400 py-3 border-t">
              Orcta © {new Date().getFullYear()}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
