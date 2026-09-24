import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import { AuthProvider, AuthContext } from "./Context/AuthContext";
import { SocketProvider } from "./Context/SocketContext";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register.jsx";
import Radar from "./components/Map/Radar";
import ChatRoom from "./components/Chat/ChatRoom";
import Wallet from "./components/Wallet/Wallet";

const queryClient = new QueryClient();

// Protected Route Wrapper to prevent unauthorized access
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketProvider>
          <Router>
            <Toaster position="top-center" />
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route
                path="/radar"
                element={
                  <ProtectedRoute>
                    <Radar />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chat/:targetUserId"
                element={
                  <ProtectedRoute>
                    <ChatRoom />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/wallet"
                element={
                  <ProtectedRoute>
                    <Wallet />
                  </ProtectedRoute>
                }
              />

              {/* Redirect unknown routes to login */}
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </Router>
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
