import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../../Context/AuthContext";
import api from "../../api/axiosConfig";

const Radar = () => {
  const navigate = useNavigate();
  const { user, updateWallet, logout } = useContext(AuthContext);

  // States
  const [userLocation, setUserLocation] = useState(null);
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [activeProfileIndex, setActiveProfileIndex] = useState(0);
  const [revealedProfiles, setRevealedProfiles] = useState({});
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [viewingStory, setViewingStory] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeChatSlot, setActiveChatSlot] = useState(null);
  const fileInputRef = useRef(null);

  const walletBalance = user?.walletBalance ?? 0;
  const isAdmin =
    user?.email?.toLowerCase() === "noballondesk@gmail.com" || user?.isAdmin;

  // Haversine formula to compute distance in km
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  // Acquire GPS Location on load
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setLocationAllowed(true);
        },
        () => {
          setLocationAllowed(false);
        },
      );
    }
  }, []);

  // 24H Story Reels
  const stories = [
    {
      id: 1,
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      user: "Aisha",
      time: "2h ago",
    },
    {
      id: 2,
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
      user: "Rahul",
      time: "4h ago",
    },
    {
      id: 3,
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
      user: "Priya",
      time: "6h ago",
    },
    {
      id: 4,
      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
      user: "Kabir",
      time: "9h ago",
    },
  ];

  // Candidates with Geo Coordinates for real proximity calculations
  const nearbyUsers = [
    {
      id: "u_1",
      name: "Archie",
      age: 24,
      pronouns: "she/her",
      city: "Bandra, Mumbai",
      lat: 19.0596,
      lng: 72.8295,
      height: "5'6\"",
      job: "UI/UX Designer at Studio",
      drinking: "Socially",
      smoking: "Never",
      zodiac: "Gemini",
      pets: "Dog Mom 🐾",
      verified: true,
      audioPromptTitle: "Hear my blind audio prompt",
      audioDuration: "0:18",
      img1: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      img2: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
      prompt1Label: "The award I should be nominated for",
      prompt1Answer:
        "Best at ordering food for the entire table without asking twice.",
      prompt2Label: "My simple pleasures",
      prompt2Answer:
        "Cold brew on Sunday mornings, finding vinyl records, and spontaneous road trips.",
    },
    {
      id: "u_2",
      name: "Vikram",
      age: 27,
      pronouns: "he/him",
      city: "Indiranagar, Bangalore",
      lat: 12.9784,
      lng: 77.6408,
      height: "6'0\"",
      job: "Product Lead @ FinTech",
      drinking: "Moderately",
      smoking: "Socially",
      zodiac: "Leo",
      pets: "Cat lover 🐈",
      verified: true,
      audioPromptTitle: "A shower thought I recently had",
      audioDuration: "0:15",
      img1: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
      img2: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
      prompt1Label: "A boundary of mine",
      prompt1Answer:
        "No phones while watching a movie together. Total immersion only.",
      prompt2Label: "We'll get along if",
      prompt2Answer:
        "You can match my energy in Mario Kart and debate best local coffee roasters.",
    },
    {
      id: "u_3",
      name: "Riya",
      age: 23,
      pronouns: "she/her",
      city: "Koramangala, Bangalore",
      lat: 12.9352,
      lng: 77.6245,
      height: "5'4\"",
      job: "Architect & Ceramics Artist",
      drinking: "Rarely",
      smoking: "Never",
      zodiac: "Virgo",
      pets: "Adopted Indie Dog 🐕",
      verified: true,
      audioPromptTitle: "My most controversial opinion",
      audioDuration: "0:21",
      img1: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
      img2: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80",
      prompt1Label: "I geek out on",
      prompt1Answer:
        "Finding hidden street food gems in random corners of old towns.",
      prompt2Label: "Green flags I look for",
      prompt2Answer:
        "Being genuinely kind to service staff and remembering small details.",
    },
  ];

  const currentProfile = nearbyUsers[activeProfileIndex] || nearbyUsers[0];
  const isPhotoRevealed = !!revealedProfiles[currentProfile.id];

  // Calculated Proximity
  const calculatedDistance =
    userLocation && currentProfile
      ? calculateDistance(
          userLocation.lat,
          userLocation.lng,
          currentProfile.lat,
          currentProfile.lng,
        )
      : null;

  // Handle Progressive Media Reveal via Audio Prompt
  const handleToggleAudio = (profileId) => {
    if (playingAudioId === profileId) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(profileId);
      toast.success("Playing voice prompt (15-20s)...", { icon: "🎙️" });
    }
  };

  const handleApproveAudio = (profileId) => {
    setRevealedProfiles((prev) => ({ ...prev, [profileId]: true }));
    toast.success("Mutual Vibe Confirmed! Photo Unblurred ✨", {
      icon: "🔓",
      duration: 3500,
    });
  };

  // Single-Slot Escrow Lock
  const handleUnlockChat = (targetUser) => {
    if (activeChatSlot && activeChatSlot.id !== targetUser.id) {
      toast.error(
        `Single-Slot Cap: You already have an active chat slot with ${activeChatSlot.name}! Resolve it before matching someone new.`,
        { duration: 4500 },
      );
      return;
    }

    if (walletBalance < 1) {
      toast.error("Insufficient tokens! Add coins to lock escrow.");
      return;
    }

    // Lock Escrow Token
    updateWallet(walletBalance - 1);
    setActiveChatSlot(targetUser);
    toast.success(
      `Escrow Slot Locked with ${targetUser.name}! Anti-Ghosting protection active.`,
      { icon: "🔒", duration: 4000 },
    );
    navigate(`/chat/${targetUser.id}`);
  };

  // Wallet Recharge Flow
  const handleRecharge = async () => {
    if (isAdmin) {
      const newBal = walletBalance + 100;
      updateWallet(newBal);
      toast.success("⚡ Admin Pass: 100 Test Coins Added!", { icon: "🪙" });
      return;
    }

    const toastId = toast.loading("Connecting to payment...");
    try {
      const { data: order } = await api.post("/wallet/create-order");
      toast.dismiss(toastId);

      const razorpayKey =
        process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_Tfq9kcJ78djyjL";

      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: "Date-NearMe",
        description: "50 Coins Recharge",
        order_id: order.orderId,
        handler: async (response) => {
          try {
            const verifyRes = await api.post("/wallet/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            updateWallet(verifyRes.data.newBalance);
            toast.success("Recharge successful! 50 Coins added.");
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },
        prefill: { email: user?.email || "" },
        theme: { color: "#ff2453" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(
        error.response?.data?.message || "Failed to initiate recharge",
      );
    }
  };

  // Handle Story Upload
  const handleStoryUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("media", file);

    const toastId = toast.loading("Posting your 24h Vibe Story...");
    try {
      await api.post("/stories/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Story posted successfully!", { id: toastId });
    } catch (error) {
      toast.error(error.response?.data?.message || "Story upload failed", {
        id: toastId,
      });
    }
  };

  const handleNextProfile = () => {
    if (activeProfileIndex < nearbyUsers.length - 1) {
      setActiveProfileIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setActiveProfileIndex(0);
      toast("You've viewed all nearby profiles! Looping feed.", { icon: "✨" });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#fbf9f5] font-sans text-[#1a1a1a] flex flex-col items-center pb-24 selection:bg-rose-500 selection:text-white relative overflow-x-hidden">
      {/* FUTURISTIC RADAR PULSE BACKGROUND (Zero-Crash, 100% Responsive) */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 flex items-center justify-center overflow-hidden">
        <div className="relative w-[600px] h-[600px] rounded-full border border-rose-300 animate-pulse">
          <div className="absolute inset-8 rounded-full border border-dashed border-rose-400/50"></div>
          <div className="absolute inset-24 rounded-full border border-rose-300/40"></div>
          <div className="absolute inset-40 rounded-full border border-dashed border-orange-300/40"></div>
          {/* Radar Sweep Line */}
          <div className="absolute top-1/2 left-1/2 w-[300px] h-[2px] bg-gradient-to-r from-rose-500 to-transparent origin-left animate-spin duration-1000"></div>
        </div>
      </div>

      {/* TOP NAVIGATION HEADER */}
      <header className="sticky top-0 w-full max-w-lg z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/90 px-4 py-2.5 flex justify-between items-center shadow-sm">
        {/* Brand Logo & Name */}
        <div
          className="flex items-center space-x-2 shrink-0 cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <img
            src="/logo.png"
            alt="Date-NearMe"
            className="w-8 h-8 object-contain rounded-xl shadow-sm"
          />
          <span className="font-extrabold text-lg tracking-tight font-serif text-stone-900">
            Date<span className="text-rose-500">-Near</span>
            <span className="text-orange-500">Me</span>
          </span>
        </div>

        {/* Right Action Cluster */}
        <div className="flex items-center space-x-2 shrink-0 relative">
          {/* Wallet Coin Pill */}
          <div
            onClick={() => navigate("/wallet")}
            className="bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-full border border-stone-300 text-xs font-black flex items-center cursor-pointer transition shadow-inner"
            title="View Coin Ledger"
          >
            <span className="mr-1 text-sm">🪙</span> {walletBalance}
          </div>

          {/* Recharge Button */}
          <button
            onClick={handleRecharge}
            className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition shadow-sm active:scale-95 flex items-center ${
              isAdmin
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-black hover:bg-stone-800 text-white"
            }`}
          >
            {isAdmin ? "⚡ +100" : "+ Add ₹50"}
          </button>

          {/* User Avatar Menu Trigger */}
          <div
            onClick={() => setShowProfileMenu((prev) => !prev)}
            className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-500 to-orange-400 text-white font-black text-xs flex items-center justify-center border-2 border-white shadow-md cursor-pointer hover:scale-105 transition"
          >
            {(user?.email?.[0] || "U").toUpperCase()}
          </div>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-2xl border border-stone-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-stone-100">
                <p className="text-[10px] font-bold text-stone-400 uppercase">
                  Logged in as
                </p>
                <p className="text-xs font-bold text-stone-900 truncate">
                  {user?.email || "User"}
                </p>
                <span className="inline-block mt-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {isAdmin ? "★ Admin Tester" : "Verified Dater"}
                </span>
              </div>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate("/wallet");
                }}
                className="w-full text-left px-4 py-2.5 text-xs font-bold text-stone-700 hover:bg-stone-50 flex items-center justify-between"
              >
                <span>🪙 Wallet Balance</span>
                <span className="font-extrabold text-rose-600">
                  {walletBalance} Coins
                </span>
              </button>
              {isAdmin && (
                <button
                  onClick={() => {
                    handleRecharge();
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-50"
                >
                  ⚡ Free Admin Recharge (+100)
                </button>
              )}
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 border-t border-stone-100"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* 24H STORY REELS CAROUSEL */}
      <div className="w-full max-w-lg px-4 py-3 bg-white/70 backdrop-blur-md border-b border-stone-200/70 z-20 overflow-x-auto scrollbar-hide flex items-center space-x-3">
        {/* Upload Button */}
        <div
          className="flex flex-col items-center cursor-pointer shrink-0"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-12 h-12 rounded-full bg-stone-100 border-2 border-dashed border-stone-400 flex items-center justify-center relative hover:scale-105 transition">
            <span className="text-xl text-stone-600 font-bold">+</span>
            <div className="absolute -bottom-0.5 -right-0.5 bg-rose-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white">
              +
            </div>
          </div>
          <span className="text-[10px] font-bold text-stone-600 mt-1">
            My Vibe
          </span>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleStoryUpload}
          className="hidden"
          accept="image/*,video/*"
        />

        {stories.map((s) => (
          <div
            key={s.id}
            onClick={() => setViewingStory(s)}
            className="flex flex-col items-center cursor-pointer shrink-0 group"
          >
            <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-rose-500 to-orange-400 group-hover:scale-105 transition shadow-sm">
              <img
                src={s.img}
                alt={s.user}
                className="w-full h-full rounded-full object-cover border-2 border-white"
              />
            </div>
            <span className="text-[10px] font-semibold text-stone-700 mt-1 truncate w-12 text-center">
              {s.user}
            </span>
          </div>
        ))}
      </div>

      {/* GPS PERMISSION PROXIMITY STRIP */}
      {!locationAllowed && (
        <div className="w-full max-w-lg px-4 pt-2.5 z-10">
          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium rounded-2xl px-3.5 py-2.5 flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-2">
              <span>📍</span>
              <span>Enable GPS to compute real physical proximity</span>
            </div>
            <button
              onClick={() => {
                if ("geolocation" in navigator) {
                  navigator.geolocation.getCurrentPosition(
                    (p) => {
                      setUserLocation({
                        lat: p.coords.latitude,
                        lng: p.coords.longitude,
                      });
                      setLocationAllowed(true);
                      toast.success("GPS Location Synced!");
                    },
                    () => toast.error("Please allow location in browser settings."),
                  );
                }
              }}
              className="text-[10px] bg-amber-200/80 hover:bg-amber-300 text-amber-900 font-bold px-2 py-1 rounded-lg transition"
            >
              Turn On
            </button>
          </div>
        </div>
      )}

      {/* SINGLE-SLOT CONCURRENCY BANNER */}
      <div className="w-full max-w-lg px-4 pt-2.5 z-10">
        <div className="bg-stone-900 text-white rounded-2xl p-3 flex items-center justify-between shadow-md border border-stone-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-sm">
              🎯
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-rose-400">
                Single-Slot Focus Protocol
              </p>
              <p className="text-[11px] text-stone-300">
                {activeChatSlot
                  ? `Active slot locked with ${activeChatSlot.name}`
                  : "Exactly ONE active chat slot • Eliminates choice overload"}
              </p>
            </div>
          </div>
          {activeChatSlot ? (
            <button
              onClick={() => navigate(`/chat/${activeChatSlot.id}`)}
              className="text-xs font-bold bg-rose-500 text-white px-3 py-1 rounded-full animate-pulse hover:bg-rose-600 transition"
            >
              View Chat →
            </button>
          ) : (
            <span className="text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-500/30">
              Slot Open
            </span>
          )}
        </div>
      </div>

      {/* HINGE CARD FEED (VERTICAL DISCOVERY STREAM) */}
      <main className="w-full max-w-lg px-4 pt-3.5 z-10 flex flex-col space-y-4">
        {/* Profile Header (Name, Age, Verified Proximity) */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200/90">
          <div className="flex justify-between items-baseline mb-1">
            <h1 className="text-3xl font-black text-stone-900 tracking-tight font-serif flex items-center">
              {currentProfile.name},{" "}
              <span className="font-normal text-stone-500 ml-1.5">
                {currentProfile.age}
              </span>
              {currentProfile.verified && (
                <span
                  className="ml-2 text-rose-500 text-base"
                  title="Verified Dater"
                >
                  ✓
                </span>
              )}
            </h1>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              ● Active nearby
            </span>
          </div>

          {/* Proximity & Location */}
          <div className="flex items-center text-xs font-semibold text-stone-500 space-x-2">
            <span>{currentProfile.pronouns}</span>
            <span>•</span>
            <span className="text-rose-600 font-bold">
              {calculatedDistance
                ? `${calculatedDistance} km away`
                : "2.1 km away"}
            </span>
            <span>•</span>
            <span>{currentProfile.city}</span>
          </div>

          {/* Hinge Vitals Badges Grid */}
          <div className="flex flex-wrap gap-1.5 mt-3.5 pt-3.5 border-t border-stone-100">
            <span className="bg-stone-100 text-stone-800 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-stone-200">
              📏 {currentProfile.height}
            </span>
            <span className="bg-stone-100 text-stone-800 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-stone-200">
              💼 {currentProfile.job}
            </span>
            <span className="bg-stone-100 text-stone-800 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-stone-200">
              🍷 {currentProfile.drinking}
            </span>
            <span className="bg-stone-100 text-stone-800 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-stone-200">
              🚭 {currentProfile.smoking}
            </span>
            <span className="bg-stone-100 text-stone-800 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-stone-200">
              ♊ {currentProfile.zodiac}
            </span>
            <span className="bg-stone-100 text-stone-800 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-stone-200">
              {currentProfile.pets}
            </span>
          </div>
        </div>

        {/* HERO PHOTO 1 (ANTI-SUPERFICIAL PROGRESSIVE BLUR REVEAL) */}
        <div className="w-full h-[460px] rounded-3xl overflow-hidden shadow-md relative bg-stone-900 border border-stone-200 group">
          <img
            src={currentProfile.img1}
            alt={currentProfile.name}
            className={`w-full h-full object-cover transition-all duration-700 ease-out ${
              isPhotoRevealed
                ? "filter blur-0 scale-100"
                : "filter blur-2xl scale-110 opacity-70"
            }`}
          />

          {/* Frosted Blur Overlay when Locked */}
          {!isPhotoRevealed && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white">
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-lg border border-white/30 flex items-center justify-center text-2xl mb-3 shadow-lg animate-pulse">
                🔒
              </div>
              <h3 className="font-serif text-xl font-bold mb-1">
                Micro-Vibe Blind Audio Warmup
              </h3>
              <p className="text-xs text-stone-200 max-w-xs mb-4">
                Photos remain blurred to prevent superficial look-first swiping.
                Listen to the voice prompt below to unlock photo reveal!
              </p>
              <button
                onClick={() => handleToggleAudio(currentProfile.id)}
                className="bg-white text-stone-900 font-extrabold text-xs px-5 py-2.5 rounded-full shadow-lg hover:scale-105 active:scale-95 transition flex items-center space-x-1.5"
              >
                <span>🎙️</span>
                <span>Listen to 15s Prompt</span>
              </button>
            </div>
          )}

          {/* Floating Like Icon (Active once revealed) */}
          {isPhotoRevealed && (
            <div
              onClick={() => handleUnlockChat(currentProfile)}
              className="absolute bottom-4 right-4 w-12 h-12 bg-white/95 backdrop-blur-md rounded-full shadow-xl border border-stone-200 flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition"
              title="Send Like & Lock Slot"
            >
              <span className="text-xl text-rose-500">♥</span>
            </div>
          )}
        </div>

        {/* BLIND AUDIO WARMUP VOICE NOTE CARD (PROGRESSIVE REVEAL GATEWAY) */}
        <div className="bg-gradient-to-r from-rose-500 via-rose-600 to-orange-500 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase font-black tracking-widest text-white/90 flex items-center">
              <span className="mr-1.5">🎙️</span> Blind Audio Warmup
            </span>
            <span className="text-xs font-bold bg-white/20 px-2.5 py-0.5 rounded-full border border-white/20">
              {currentProfile.audioDuration}
            </span>
          </div>

          <h3 className="text-lg font-bold font-serif mb-3 leading-snug">
            "{currentProfile.audioPromptTitle}"
          </h3>

          {/* Audio Waveform Player */}
          <div className="flex items-center space-x-3 bg-black/25 backdrop-blur-md rounded-2xl p-3 border border-white/10 mb-3">
            <button
              onClick={() => handleToggleAudio(currentProfile.id)}
              className="w-11 h-11 rounded-full bg-white text-rose-600 font-black flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition shrink-0 text-base"
            >
              {playingAudioId === currentProfile.id ? "❚❚" : "▶"}
            </button>
            <div className="flex-1 flex items-center space-x-1 h-7">
              {[40, 75, 30, 95, 60, 45, 80, 50, 90, 35, 65, 85, 30, 70, 50].map(
                (h, idx) => (
                  <div
                    key={idx}
                    style={{ height: `${h}%` }}
                    className={`flex-1 rounded-full transition-all duration-300 ${
                      playingAudioId === currentProfile.id
                        ? "bg-white animate-pulse"
                        : "bg-white/60"
                    }`}
                  ></div>
                ),
              )}
            </div>
          </div>

          {/* Approve Vibe / Unlock Photos Button */}
          {!isPhotoRevealed ? (
            <button
              onClick={() => handleApproveAudio(currentProfile.id)}
              className="w-full bg-white hover:bg-stone-100 text-rose-600 font-extrabold text-xs py-3 rounded-xl transition shadow-md flex items-center justify-center space-x-1.5 active:scale-95"
            >
              <span>✨ Approve Vibe & Unlock Photo Reveal</span>
            </button>
          ) : (
            <div className="text-center text-xs font-bold text-white/90 bg-white/20 py-2 rounded-xl border border-white/20">
              ✓ Progressive Media Reveal Unlocked
            </div>
          )}
        </div>

        {/* HINGE PROMPT CARD 1 */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/90 relative">
          <p className="text-[11px] font-black uppercase tracking-wider text-stone-400 mb-2">
            {currentProfile.prompt1Label}
          </p>
          <h2 className="text-2xl font-serif font-medium text-stone-900 leading-snug">
            "{currentProfile.prompt1Answer}"
          </h2>
          <div
            onClick={() => handleUnlockChat(currentProfile)}
            className="absolute -bottom-4 right-5 w-11 h-11 bg-stone-900 text-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-rose-600 transition hover:scale-105 active:scale-95"
            title="Like this prompt"
          >
            <span className="text-base text-rose-400">♥</span>
          </div>
        </div>

        {/* SECONDARY CANDID PHOTO */}
        <div className="w-full h-[420px] rounded-3xl overflow-hidden shadow-md relative bg-stone-900 border border-stone-200">
          <img
            src={currentProfile.img2}
            alt={currentProfile.name}
            className={`w-full h-full object-cover transition-all duration-700 ease-out ${
              isPhotoRevealed
                ? "filter blur-0 scale-100"
                : "filter blur-xl scale-110 opacity-70"
            }`}
          />
          {isPhotoRevealed && (
            <div
              onClick={() => handleUnlockChat(currentProfile)}
              className="absolute bottom-4 right-4 w-12 h-12 bg-white/95 backdrop-blur-md rounded-full shadow-xl border border-stone-200 flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition"
            >
              <span className="text-xl text-rose-500">♥</span>
            </div>
          )}
        </div>

        {/* HINGE PROMPT CARD 2 */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/90 relative">
          <p className="text-[11px] font-black uppercase tracking-wider text-stone-400 mb-2">
            {currentProfile.prompt2Label}
          </p>
          <h2 className="text-2xl font-serif font-medium text-stone-900 leading-snug">
            "{currentProfile.prompt2Answer}"
          </h2>
          <div
            onClick={() => handleUnlockChat(currentProfile)}
            className="absolute -bottom-4 right-5 w-11 h-11 bg-stone-900 text-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-rose-600 transition hover:scale-105 active:scale-95"
          >
            <span className="text-base text-rose-400">♥</span>
          </div>
        </div>

        {/* STICKY BOTTOM HINGE CONTROLS */}
        <div className="sticky bottom-20 w-full z-30 flex items-center justify-center space-x-3 py-2">
          {/* Skip Profile Button */}
          <button
            onClick={handleNextProfile}
            className="w-14 h-14 rounded-full bg-white border border-stone-300 text-stone-700 shadow-xl flex items-center justify-center hover:bg-stone-100 hover:scale-105 active:scale-95 transition text-2xl font-bold shrink-0"
            title="Pass to next profile"
          >
            ✕
          </button>

          {/* Single-Slot Escrow Lock & Chat Button */}
          <button
            onClick={() => handleUnlockChat(currentProfile)}
            className="flex-1 bg-black hover:bg-stone-800 text-white font-extrabold py-4 px-6 rounded-full shadow-2xl flex items-center justify-center space-x-2 transition hover:scale-[1.02] active:scale-95"
          >
            <span className="text-sm md:text-base">🔒 Lock Escrow Slot & Chat</span>
            <span className="bg-rose-500 text-white text-xs px-2.5 py-0.5 rounded-full font-black">
              1 Coin
            </span>
          </button>
        </div>
      </main>

      {/* FULLSCREEN STORY VIEWER MODAL */}
      {viewingStory && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-md">
          <div className="relative w-full max-w-md h-[88vh] rounded-3xl overflow-hidden bg-stone-950 shadow-2xl flex flex-col">
            {/* Header */}
            <div className="absolute top-0 w-full p-4 flex justify-between items-center z-20 bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex items-center space-x-2.5">
                <img
                  src={viewingStory.img}
                  alt={viewingStory.user}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white"
                />
                <div>
                  <span className="text-white font-bold text-sm block leading-tight">
                    {viewingStory.user}
                  </span>
                  <span className="text-white/70 text-[10px]">
                    {viewingStory.time}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setViewingStory(null)}
                className="text-white text-2xl font-bold w-8 h-8 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/80"
              >
                ✕
              </button>
            </div>

            {/* Media */}
            <img
              src={viewingStory.img}
              alt="Story"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* HINGE CLASSIC 5-TAB BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 w-full max-w-lg z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 px-6 py-2.5 flex justify-between items-center shadow-lg">
        {/* Tab 1: Discover */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex flex-col items-center text-rose-600 font-extrabold group"
        >
          <span className="text-2xl leading-none">H</span>
          <span className="text-[10px] font-bold mt-1">Discover</span>
        </button>

        {/* Tab 2: Standouts */}
        <button
          onClick={() =>
            toast("Standouts sorted by reverse-swipe value vectors!", {
              icon: "⭐",
            })
          }
          className="flex flex-col items-center text-stone-400 hover:text-stone-800 transition"
        >
          <span className="text-xl">⭐</span>
          <span className="text-[10px] font-medium mt-1">Standouts</span>
        </button>

        {/* Tab 3: Story Camera */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center text-stone-400 hover:text-stone-800 transition"
        >
          <span className="text-xl">📸</span>
          <span className="text-[10px] font-medium mt-1">Vibe Story</span>
        </button>

        {/* Tab 4: Active Chat Slot */}
        <button
          onClick={() => {
            if (activeChatSlot) {
              navigate(`/chat/${activeChatSlot.id}`);
            } else {
              navigate(`/chat/${currentProfile.id}`);
            }
          }}
          className="flex flex-col items-center text-stone-400 hover:text-stone-800 transition relative"
        >
          <span className="text-xl">💬</span>
          <span className="text-[10px] font-medium mt-1">Chat Slot</span>
          <span className="absolute top-0 right-2 w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
        </button>

        {/* Tab 5: Wallet / Account */}
        <button
          onClick={() => navigate("/wallet")}
          className="flex flex-col items-center text-stone-400 hover:text-stone-800 transition"
        >
          <span className="text-xl">🪙</span>
          <span className="text-[10px] font-medium mt-1">
            Wallet ({walletBalance})
          </span>
        </button>
      </nav>
    </div>
  );
};

export default Radar;
