import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axiosConfig";
import { AuthContext } from "../../Context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    gender: "Male",
  });
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", formData);
      toast.success("OTP sent to your email!");
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/verify-otp", {
        email: formData.email,
        otp,
      });
      login(res.data.user, res.data.token);
      toast.success("Verification complete!");
      navigate("/radar");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
      <h2>Register</h2>
      {step === 1 ? (
        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: "15px" }}>
            <label>Email</label>
            <br />
            <input
              type="email"
              required
              style={{ width: "100%", padding: "8px" }}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>Password</label>
            <br />
            <input
              type="password"
              required
              style={{ width: "100%", padding: "8px" }}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>Gender</label>
            <br />
            <select
              style={{ width: "100%", padding: "8px" }}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              background: "#28a745",
              color: "#fff",
            }}
          >
            Get OTP
          </button>
          <p style={{ marginTop: "15px" }}>
            Already registered? <Link to="/login">Login</Link>
          </p>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP}>
          <div style={{ marginBottom: "15px" }}>
            <label>Enter 6-Digit OTP</label>
            <br />
            <input
              type="text"
              required
              style={{ width: "100%", padding: "8px" }}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              background: "#28a745",
              color: "#fff",
            }}
          >
            Verify & Login
          </button>
        </form>
      )}
    </div>
  );
};

export default Register;
