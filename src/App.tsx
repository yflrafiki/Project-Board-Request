import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { RequestBoard } from "./Pages/RequestBoard";
import { SignUp } from "./Pages/SignUp";
import { Login } from "./Pages/Login";
import { Tags } from "./Pages/Tags";
import { RequestProvider } from "./Contexts/RequestContext";
import { AdminProvider, useAdminContext } from "./Contexts/AdminContext";
import { UserProvider } from "./Contexts/UserContext";
import { Toaster } from "react-hot-toast";
import { Sidebar } from "./Components/Sidebar";
import { SidebarProvider, useSidebarContext } from "./Contexts/SidebarContext";
import { useState } from "react";

// 🧩 Layout with dynamic sidebar width & admin modal
function AppLayout({ children }: { children: React.ReactNode }) {
  const { isExpanded } = useSidebarContext();
  const { showAdminPrompt, setShowAdminPrompt, toggleAdmin } = useAdminContext();
  const [adminPassword, setAdminPassword] = useState("");

  const handlePasswordSubmit = () => {
    toggleAdmin(adminPassword);
    setAdminPassword("");
  };

  return (
    <div className="flex min-h-screen bg-gray-50 transition-all duration-300">
      <Sidebar />
      <main
        className={`flex-1 transition-all duration-300 px-4 py-6 sm:px-6 ${
          isExpanded ? "lg:ml-64" : "lg:ml-16"
        }`}
      >
        {children}
      </main>

      {/* Admin Password Modal */}
      {showAdminPrompt && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm shadow-md border">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Enter Admin Password</h3>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Password"
              className="w-full border px-3 py-2 rounded text-sm text-gray-700 mb-3"
              onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-2 rounded text-white !bg-blue-600 hover:bg-blue-700"
                onClick={handlePasswordSubmit}
              >
                Submit
              </button>
              <button
                onClick={() => {
                  setShowAdminPrompt(false);
                  setAdminPassword("");
                }}
                className="px-3 py-2 rounded !bg-blue-600 text-gray-700 border"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <SidebarProvider>
      <Router>
        <AdminProvider>
          <UserProvider>
            <RequestProvider>
              <Toaster position="top-right" />
              <Routes>
                <Route path="/" element={<Navigate to="/signup" />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<AppLayout><RequestBoard /></AppLayout>} />
                <Route path="/tags" element={<AppLayout><Tags /></AppLayout>} />
              </Routes>
            </RequestProvider>
          </UserProvider>
        </AdminProvider>
      </Router>
    </SidebarProvider>
  );
}

export default App;
