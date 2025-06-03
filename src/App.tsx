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
import { SidebarProvider } from "./Contexts/SidebarContext";

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-0 lg:ml-64 bg-gray-50 p-4 sm:p-6">
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
