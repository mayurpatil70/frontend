import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
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
      // 1. Create order on your backend
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 9, type: "registration" }),
      });
      const orderData = await orderRes.json();

      if (!orderData.success) throw new Error("Failed to initiate payment");

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: "INR",
        name: "NEARME",
        description: "Lifetime Registration Fee",
        order_id: orderData.order.id,
        handler: async function (response) {
          toast.success("Payment successful! Creating profile...");
          // Backend registration API call goes here
          navigate("/login");
        },
        prefill: { email: formData.email },
        theme: { color: "#000000" }, // Updated to match the black/white theme
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error(error.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans text-black">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
            Join NearMe
          </h2>
          <p className="text-gray-500 font-medium mt-2">
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
