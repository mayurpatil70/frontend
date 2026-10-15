import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axiosConfig";
import { AuthContext } from "../../Context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", formData);
      login({ id: data.id, email: data.email }, data.token);
      toast.success("Successfully logged in!");
      navigate("/radar");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const emailToReset = prompt(
      "Enter your registered email to reset your password:",
    );
    if (!emailToReset) return;
    const toastId = toast.loading("Sending reset link...");
    try {
      const { data } = await api.post("/auth/forgot-password", { email: emailToReset });
      toast.success(data.message || `Password reset link sent to ${emailToReset}`, {
        id: toastId,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reset link", {
        id: toastId,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans text-black">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-24 h-24 rounded-2xl bg-white shadow-md p-2 border border-gray-100 flex items-center justify-center mb-3 hover:scale-105 transition-transform duration-300">
            <img
              src="/logo.png"
              alt="Date-NearMe"
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Welcome to Date-NearMe
          </h2>
          <p className="text-gray-500 text-sm font-medium mt-1">
            "The dating app designed to be deleted."
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-bold text-gray-700">
                Password
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs text-gray-500 hover:text-black font-bold transition-colors"
              >
                Forgot?
              </button>
            </div>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black hover:bg-gray-800 text-white font-bold rounded-xl px-4 py-4 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100 mt-8 flex justify-center items-center shadow-lg"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-8 text-sm font-medium">
          New to Date-NearMe?{" "}
          <Link
            to="/register"
            className="text-black hover:underline font-bold transition-colors"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
