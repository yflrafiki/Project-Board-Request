import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

export const Login = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("rememberMeUser") || "{}");
    if (saved?.input) setInput(saved.input);
    if (saved?.password) setPassword(saved.password);
  }, []);

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const found = users.find(
      (u: any) =>
        (u.name.toLowerCase() === input.toLowerCase() ||
         u.email.toLowerCase() === input.toLowerCase()) &&
        u.password === password
    );

    if (found) {
      toast.success("Login successful!");
      localStorage.setItem("user", JSON.stringify(found));
      if (rememberMe) {
        localStorage.setItem("rememberMeUser", JSON.stringify({ input, password }));
      } else {
        localStorage.removeItem("rememberMeUser");
      }
      setTimeout(() => navigate("/dashboard"), 1000);
    } else {
      toast.error("Invalid name/email or password.");
    }
  };

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row overflow-hidden">
      <Toaster />

      {/* Welcome Section */}
      <div className="w-full lg:w-1/2 h-[40vh] lg:h-full bg-gradient-to-tr from-indigo-800 via-purple-700 to-blue-600 text-white flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Welcome Back to Orcta</h1>
          <p className="text-lg text-indigo-100">Log in to manage your project requests</p>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-indigo-600 mb-2">Log In</h2>
          <p className="text-sm text-center text-gray-500 mb-6">
            Don’t have an account?{" "}
            <a href="/signup" className="text-indigo-600 hover:underline">Sign up</a>
          </p>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter your name or email"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-800"
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-800"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-3 text-sm text-gray-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember Me
            </label>

            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium py-3 rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all"
            >
              Login
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-400">
            Orcta © {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </div>
  );
};
