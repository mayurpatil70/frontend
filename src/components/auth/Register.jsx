import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axiosConfig";
import { AuthContext } from "../../Context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    gender: "Male",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePaymentAndRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create order on backend via live Vercel API
      const { data: orderData } = await api.post("/payments/create-order", {
        amount: 9,
        type: "registration",
      });

      if (!orderData.success) throw new Error("Failed to initiate payment");

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: "INR",
        name: "Date-NearMe",
        description: "Lifetime Registration Fee",
        order_id: orderData.order.id,
        handler: async function (response) {
          try {
            const { data } = await api.post("/auth/register", formData);
            login({ id: data.id, email: data.email }, data.token);
            toast.success("Payment verified! Welcome to Date-NearMe.");
            navigate("/radar");
          } catch (err) {
            toast.error(err.response?.data?.message || "Registration failed");
            navigate("/login");
          }
        },
        prefill: { email: formData.email },
        theme: { color: "#ff2453" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Payment initiation failed");
    } finally {
      setLoading(false);
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
            Join Date-NearMe
          </h2>
          <p className="text-gray-500 font-medium mt-1 text-sm">
            Unlock lifetime access for just ₹9.
          </p>
        </div>

        <form onSubmit={handlePaymentAndRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Gender
            </label>
            <select
              name="gender"
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors appearance-none font-medium"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black hover:bg-gray-800 text-white font-bold rounded-xl px-4 py-4 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100 flex justify-center items-center mt-8 shadow-lg"
          >
            {loading ? "Processing..." : "Pay ₹9 & Register"}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-8 text-sm font-medium">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-black hover:underline font-bold transition-colors"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
