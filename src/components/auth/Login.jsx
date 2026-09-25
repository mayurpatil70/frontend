import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Replace with your actual backend login logic when ready
      /*
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            // Save token to localStorage here
            */

      setTimeout(() => {
        setLoading(false);
        toast.success("Successfully logged in!");
        navigate("/radar");
      }, 1000);
    } catch (error) {
      toast.error(error.message || "Login failed");
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
      // Calls your newly created backend route
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailToReset }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          data.message || `Password reset link sent to ${emailToReset}`,
          { id: toastId },
        );
      } else {
        throw new Error(data.message || "Failed to send reset link");
      }
    } catch (error) {
      toast.error(error.message || "Network error. Is the backend running?", {
        id: toastId,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans text-black">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
            NEARME
          </h2>
          <p className="text-gray-500 font-medium italic">
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
          New to NearMe?{" "}
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
