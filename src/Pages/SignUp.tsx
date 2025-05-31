import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminContext } from "../Contexts/AdminContext";
import { useUserContext } from "../Contexts/UserContext";
import { v4 as uuidv4 } from "uuid";
import toast, { Toaster } from "react-hot-toast";

export const SignUp = () => {
  const navigate = useNavigate();
  const { toggleAdmin } = useAdminContext();
  const { registerUser } = useUserContext();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user", // or 'admin'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      toast.error("All fields are required.");
      return;
    }

    const newUser = {
      id: uuidv4(),
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role as "user" | "admin",
    };

    // Save to context and localStorage
    registerUser(newUser);

    const existing = JSON.parse(localStorage.getItem("users") || "[]");
    const alreadyExists = existing.find(
      (u: any) => u.email.toLowerCase() === newUser.email.toLowerCase()
    );

    if (alreadyExists) {
      toast.error("User already exists with this email.");
      return;
    }

    localStorage.setItem("users", JSON.stringify([...existing, newUser]));
    localStorage.setItem("user", JSON.stringify(newUser));

    // Set admin/user mode
    newUser.role === "admin" ? toggleAdmin("admin123") : toggleAdmin();

    toast.success("Account created successfully!");
    setTimeout(() => navigate("/dashboard"), 1000);
  };

  return (
    <div className="w-screen h-screen flex flex-col lg:flex-row overflow-hidden bg-white">
      <Toaster />

      {/* Left Side - Welcome */}
      <div className="w-full lg:w-1/2 h-1/2 lg:h-full bg-blue-600 text-white flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Join Orcta</h1>
          <p className="text-lg text-blue-100">Create an account to manage project requests</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-blue-600 mb-2">Create Account</h2>
          <p className="text-sm text-center text-gray-500 mb-6">
            Already have an account?{" "}
            <a href="/login" className="!text-blue-600 hover:underline">Log in</a>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400"
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <button
              type="submit"
              className="w-full bg-gradient-to-r !bg-blue-600 to-indigo-600 text-white font-medium py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
            >
              Sign Up
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            Orcta © {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </div>
  );
};
