import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { RequestBoard } from "./Pages/RequestBoard";
import { SignUp } from "./Pages/SignUp";
import { Login } from "./Pages/Login";
import { Tags } from "./Pages/Tags";
import { RequestProvider } from "./Contexts/RequestContext";
import { AdminProvider } from "./Contexts/AdminContext";
import { UserProvider } from "./Contexts/UserContext";
import { Toaster } from "react-hot-toast";
import { Sidebar } from "./Components/Sidebar";
import { SidebarProvider, useSidebarContext } from "./Contexts/SidebarContext";

// 🧩 Layout with dynamic sidebar width
function AppLayout({ children }: { children: React.ReactNode }) {
  const { isExpanded } = useSidebarContext();

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
