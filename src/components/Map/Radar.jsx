import React, { useEffect, useState, useContext } from "react";
import { MapContainer, TileLayer, Circle, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../../api/axiosConfig";
import { AuthContext } from "../../Context/AuthContext";

// Fix for default Leaflet markers in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const Radar = () => {
  const { user, updateWallet } = useContext(AuthContext);
  const [location, setLocation] = useState(null);

  // 1. Get GPS Location on Mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const coords = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          };
          setLocation(coords);

          // Update user's location in backend
          try {
            await api.post("/users/location", coords);
          } catch (err) {
            console.error("Failed to update location in DB");
          }
        },
        (err) => toast.error("GPS permission required for Radar to work"),
        { enableHighAccuracy: false, timeout: 5000 }, // Don't enforce high accuracy to save battery
      );
    }
  }, []);

  // 2. Fetch Nearby Users using TanStack Query
  const { data: nearbyUsers = [], isLoading } = useQuery({
    queryKey: ["nearbyUsers", location],
    queryFn: async () => {
      if (!location) return [];
      const { data } = await api.get(
        `/users/nearby?latitude=${location.latitude}&longitude=${location.longitude}`,
      );
      return data;
    },
    enabled: !!location, // Only run query if we have GPS coords
    refetchInterval: 60000, // Refetch every 60 seconds
  });

  const handleUnlockChat = async (targetUserId) => {
    try {
      const res = await api.post("/chat/unlock", { targetUserId });
      toast.success(res.data.message);
      updateWallet(res.data.walletBalance);
      // In a real app, redirect to ChatRoom.jsx here
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to unlock chat");
    }
  };

  if (!location)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        Locating you...
      </div>
    );

  return (
    <div>
      <div
        style={{
          padding: "15px",
          background: "#333",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h3>NearMe Radar</h3>
        <div>
          Coins: {user?.walletBalance} |{" "}
          {user?.hasLifetimeAccess ? "Premium" : "Free"}
        </div>
      </div>

      {/* The Map Layer */}
      <div style={{ height: "50vh", width: "100%" }}>
        <MapContainer
          center={[location.latitude, location.longitude]}
          zoom={14}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* User's own location indicator */}
          <Circle
            center={[location.latitude, location.longitude]}
            radius={500}
            pathOptions={{ color: "blue" }}
          >
            <Popup>You are within this zone.</Popup>
          </Circle>
        </MapContainer>
      </div>

      {/* List Layer */}
      <div style={{ padding: "20px" }}>
        <h4>People Nearby ({nearbyUsers.length})</h4>
        {isLoading && <p>Scanning area...</p>}

        {nearbyUsers.map((person) => (
          <div
            key={person._id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "15px",
              borderBottom: "1px solid #ccc",
            }}
          >
            <div>
              <strong>{person.gender} User</strong>
              <br />
              <small>{Math.round(person.distance)} meters away</small>
            </div>
            <button
              onClick={() => handleUnlockChat(person._id)}
              style={{
                background: "#007bff",
                color: "#fff",
                border: "none",
                padding: "8px 12px",
                borderRadius: "4px",
              }}
            >
              Chat (1 Coin)
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Radar;
