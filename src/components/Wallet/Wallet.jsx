import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axiosConfig";
import { AuthContext } from "../../Context/AuthContext";

const Wallet = () => {
  const { user, updateWallet } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRecharge = async () => {
    try {
      // 1. Create Order on Backend
      const { data: order } = await api.post("/wallet/create-order");

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Add to frontend .env
        amount: order.amount,
        currency: order.currency,
        name: "NearMe App",
        description: "50 Coins Recharge",
        order_id: order.orderId,
        handler: async (response) => {
          try {
            // 3. Verify Payment on Backend
            const verifyRes = await api.post("/wallet/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            toast.success("Recharge successful!");
            updateWallet(verifyRes.data.newBalance);
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error("Could not initiate payment");
    }
  };

  const handleUnlockLifetime = async () => {
    try {
      const res = await api.post("/wallet/unlock-lifetime");
      toast.success(res.data.message);
      updateWallet(res.data.walletBalance);
      // Reload window to update global 'hasLifetimeAccess' state
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to unlock");
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <button onClick={() => navigate("/radar")} style={{ float: "left" }}>
        Back
      </button>
      <div style={{ clear: "both" }}></div>

      <h2>Your Wallet</h2>
      <h1>{user?.walletBalance} Coins</h1>
      <p>
        Status: {user?.hasLifetimeAccess ? "Lifetime Member" : "Unregistered"}
      </p>

      <button
        onClick={handleRecharge}
        style={{
          width: "100%",
          padding: "15px",
          background: "#007bff",
          color: "#fff",
          border: "none",
          marginBottom: "15px",
        }}
      >
        Recharge 50 Coins (₹50)
      </button>

      {!user?.hasLifetimeAccess && (
        <button
          onClick={handleUnlockLifetime}
          style={{
            width: "100%",
            padding: "15px",
            background: "#28a745",
            color: "#fff",
            border: "none",
          }}
        >
          Unlock Lifetime Access (9 Coins)
        </button>
      )}
    </div>
  );
};

export default Wallet;
