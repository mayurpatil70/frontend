import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically redirect to the login/register screen after 3.5 seconds
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-screen w-screen bg-black flex flex-col justify-center items-center overflow-hidden">
      {/* Make sure rcb-poster.jpg is inside your frontend/public folder */}
      <img
        src="/rcb-poster.jpg"
        alt="49 All Out RCB"
        className="w-full h-full object-cover opacity-90 animate-pulse"
      />
      <div className="absolute bottom-10 flex flex-col items-center">
        <h1 className="text-4xl font-bold tracking-widest text-white mb-2 drop-shadow-lg">
          NEARME
        </h1>
        <div className="w-8 h-8 border-4 border-t-nearme-accent border-gray-300 rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default SplashScreen;
