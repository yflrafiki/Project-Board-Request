import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { RequestBoard } from "./Pages/RequestBoard";
import { SignUp } from "./Pages/SignUp";
import { Login } from "./Pages/Login";
import { RequestProvider } from "./Contexts/RequestContext";
import { AdminProvider } from "./Contexts/AdminContext";
import { UserProvider } from "./Contexts/UserContext";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <AdminProvider>
        <UserProvider>
          <RequestProvider>
            <Toaster position="top-right" />
            <Routes>
              <Route path="/" element={<Navigate to="/signup" />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<RequestBoard />} />
              {/* Add more routes if needed */}
            </Routes>
          </RequestProvider>
        </UserProvider>
      </AdminProvider>
    </Router>
  );
}

export default App;
