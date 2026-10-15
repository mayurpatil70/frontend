import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import toast from "react-hot-toast";
import { AuthContext } from "../../Context/AuthContext";
import api from "../../api/axiosConfig";

const Radar = () => {
  const navigate = useNavigate();
  const { user, updateWallet, logout } = useContext(AuthContext);
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [viewingStory, setViewingStory] = useState(null);
  const [activeProfileIndex, setActiveProfileIndex] = useState(0);
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const fileInputRef = useRef(null);

  const walletBalance = user?.walletBalance ?? 0;
  const isAdmin =
    user?.email?.toLowerCase() === "noballondesk@gmail.com" || user?.isAdmin;

  // Prompt user for GPS Location on load
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocationAllowed(true);
        },
        () => {
          toast.error("Please enable GPS location to calculate exact proximity.");
        },
      );
    }
  }, []);

  const stories = [
    {
      id: 1,
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      user: "Aisha",
    },
    {
      id: 2,
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
      user: "Rahul",
    },
    {
      id: 3,
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
      user: "Priya",
    },
    {
      id: 4,
      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
      user: "Kabir",
    },
  ];

  // Authentic Hinge-Style Profile Data
  const nearbyUsers = [
    {
      id: "u_1",
      name: "Archie",
      age: 24,
      pronouns: "she/her",
      location: "Bandra West, Mumbai",
      distance: "2 km away",
      height: "5'6\"",
      job: "UI/UX Designer at Studio",
      drinking: "Socially",
      smoking: "Never",
      zodiac: "Gemini",
      pets: "Dog Parent 🐾",
      verified: true,
      audioPromptTitle: "Hear my blind audio prompt",
      audioDuration: "0:18",
      img1: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      img2: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
      prompt1Label: "The award I should be nominated for",
      prompt1Answer: "Best at ordering food for the entire table without asking twice.",
      prompt2Label: "My simple pleasures",
      prompt2Answer: "Cold brew on Sunday mornings, finding vinyl records, and unscripted road trips.",
    },
    {
      id: "u_2",
      name: "Vikram",
      age: 27,
      pronouns: "he/him",
      location: "Indiranagar, Bangalore",
      distance: "4 km away",
      height: "6'0\"",
      job: "Founder @ FinTech",
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
      prompt1Answer: "No texting while watching a movie in the theatre. Total immersion only.",
      prompt2Label: "We'll get along if",
      prompt2Answer: "You can match my energy in Mario Kart and debate best coffee roasters.",
    },
    {
      id: "u_3",
      name: "Riya",
      age: 23,
      pronouns: "she/her",
      location: "Koramangala, Bangalore",
      distance: "1.5 km away",
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
      prompt1Answer: "Finding hidden street food gems in random corners of old towns.",
      prompt2Label: "Green flags I look for",
      prompt2Answer: "Being genuinely kind to service staff and remembering tiny details.",
    },
  ];

  // REAL WALLET RECHARGE
  const handleRecharge = async () => {
    // ⚡ ADMIN TEST BYPASS
    if (isAdmin) {
      const newBalance = walletBalance + 100;
      updateWallet(newBalance);
      toast.success("⚡ Admin Pass: Added 100 Test Coins!", { icon: "🪙" });
      return;
    }

    // REGULAR RAZORPAY RECHARGE
    const toastId = toast.loading("Connecting to Razorpay...");
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

  const handleUnlockChat = (targetUser) => {
    if (walletBalance < 1) {
      toast.error("Insufficient balance! Tap '+ Add ₹50' to add coins.");
      return;
    }
    // Lock 1 coin in escrow
    updateWallet(walletBalance - 1);
    toast.success(`Active Slot locked with ${targetUser.name}! Escrow active.`, {
      icon: "🔒",
      duration: 3500,
    });
    navigate(`/chat/${targetUser.id}`);
  };

  const handleStoryUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("media", file);

    const toastId = toast.loading("Uploading story to Cloudinary...");
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

  const currentProfile = nearbyUsers[activeProfileIndex] || nearbyUsers[0];

  const handleNextProfile = () => {
    if (activeProfileIndex < nearbyUsers.length - 1) {
      setActiveProfileIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setActiveProfileIndex(0);
      toast("You've seen all nearby profiles! Looping feed.", { icon: "✨" });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#fbf9f5] font-sans text-[#1a1a1a] flex flex-col items-center pb-24 selection:bg-rose-500 selection:text-white">
      {/* Background Subtle Map Layer */}
      <div className="fixed inset-0 z-0 opacity-15 pointer-events-none">
        <MapContainer
          center={[19.076, 72.8777]}
          zoom={12}
          className="h-full w-full"
          zoomControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </MapContainer>
      </div>

      {/* TOP HEADER (Hinge Brand + Stories + Wallet Pill) */}
      <header className="sticky top-0 w-full max-w-lg z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 py-2.5 flex justify-between items-center shadow-sm">
        {/* Brand Logo */}
        <div
          className="flex items-center space-x-2 shrink-0 cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <img
            src="/logo.png"
            alt="Date-NearMe"
            className="w-8 h-8 object-contain rounded-xl shadow-sm"
          />
          <span className="font-extrabold text-lg tracking-tight text-gray-900 font-serif">
            Date<span className="text-rose-500">-Near</span>
            <span className="text-orange-500">Me</span>
          </span>
        </div>

        {/* Right: Coins Badge, Recharge, Profile Avatar */}
        <div className="flex items-center space-x-2 shrink-0 relative">
          <div
            onClick={() => navigate("/wallet")}
            className="bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-full border border-stone-300 text-xs font-black flex items-center cursor-pointer transition shadow-inner"
            title="View Wallet"
          >
            <span className="mr-1 text-sm">🪙</span> {walletBalance}
          </div>

          <button
            onClick={handleRecharge}
            className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition shadow-sm active:scale-95 flex items-center ${
              isAdmin
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-black hover:bg-stone-800 text-white"
            }`}
          >
            {isAdmin ? "⚡ +100 Coins" : "+ Add ₹50"}
          </button>

          {/* User Avatar Menu Trigger */}
          <div
            onClick={() => setShowProfileMenu((prev) => !prev)}
            className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-500 to-orange-400 text-white font-black text-xs flex items-center justify-center border-2 border-white shadow-md cursor-pointer hover:scale-105 transition"
          >
            {(user?.email?.[0] || "U").toUpperCase()}
          </div>

          {/* Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-2xl border border-stone-200 py-2 z-50 animate-fadeIn">
              <div className="px-4 py-2 border-b border-stone-100">
                <p className="text-xs font-bold text-gray-500 uppercase">Signed in as</p>
                <p className="text-xs font-semibold text-gray-900 truncate">
                  {user?.email || "User"}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate("/wallet");
                }}
                className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-stone-100 flex items-center justify-between"
              >
                <span>🪙 Wallet Balance</span>
                <span className="font-extrabold text-rose-600">{walletBalance} Coins</span>
              </button>
              {isAdmin && (
                <button
                  onClick={() => {
                    handleRecharge();
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-50"
                >
                  ⚡ Admin Fast Recharge (+100)
                </button>
              )}
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 border-t border-stone-100"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* STORIES ROW (Hinge / Instagram style horizontal reel) */}
      <div className="w-full max-w-lg px-4 py-3 bg-white/60 backdrop-blur-sm border-b border-stone-200/60 z-20 overflow-x-auto scrollbar-hide flex items-center space-x-3">
        {/* Post Story Trigger */}
        <div
          className="flex flex-col items-center cursor-pointer shrink-0"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-13 h-13 rounded-full bg-stone-100 border-2 border-dashed border-stone-400 flex items-center justify-center relative hover:scale-105 transition">
            <span className="text-lg text-stone-600 font-bold">+</span>
            <div className="absolute -bottom-1 -right-1 bg-rose-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white">
              +
            </div>
          </div>
          <span className="text-[10px] font-semibold text-stone-600 mt-1">My Vibe</span>
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
            <div className="w-13 h-13 rounded-full p-[2px] bg-gradient-to-tr from-rose-500 to-orange-400 group-hover:scale-105 transition">
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

      {/* LOCATION PERMISSION NOTICE */}
      {!locationAllowed && (
        <div className="w-full max-w-lg px-4 pt-2 z-10">
          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium rounded-xl px-3 py-2 flex items-center justify-between">
            <span>📍 Allow GPS location to calculate exact proximity</span>
            <span className="text-[10px] bg-amber-200/60 px-2 py-0.5 rounded font-bold">GPS Off</span>
          </div>
        </div>
      )}

      {/* SINGLE-SLOT CONCURRENCY BANNER */}
      <div className="w-full max-w-lg px-4 pt-3 z-10">
        <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white rounded-2xl px-4 py-2.5 flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🎯</span>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-rose-400">
                Single-Slot Focus Protocol
              </p>
              <p className="text-[11px] text-stone-300">
                1 active chat at a time • Anti-choice overload
              </p>
            </div>
          </div>
          <span className="text-xs font-black bg-white/10 px-2.5 py-1 rounded-full border border-white/20">
            Slot Open
          </span>
        </div>
      </div>

      {/* MAIN HINGE PROFILE FEED */}
      <main className="w-full max-w-lg px-4 pt-4 z-10 flex flex-col space-y-5">
        {/* Card Header (Name, Age, Distance) */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200/80">
          <div className="flex justify-between items-baseline mb-2">
            <h1 className="text-3xl font-black text-stone-900 tracking-tight font-serif">
              {currentProfile.name},{" "}
              <span className="font-normal text-stone-500">{currentProfile.age}</span>
            </h1>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              ● Active nearby
            </span>
          </div>

          <div className="flex items-center text-xs font-semibold text-stone-500 space-x-2">
            <span>{currentProfile.pronouns}</span>
            <span>•</span>
            <span className="text-rose-600 font-bold">{currentProfile.distance}</span>
            <span>•</span>
            <span>{currentProfile.location}</span>
          </div>

          {/* Hinge Vitals Grid */}
          <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-stone-100">
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

        {/* Hero Photo 1 */}
        <div className="w-full h-[480px] rounded-3xl overflow-hidden shadow-md relative bg-stone-200 border border-stone-200">
          <img
            src={currentProfile.img1}
            alt={currentProfile.name}
            className="w-full h-full object-cover"
          />
          {/* Floating Hinge Heart Button */}
          <div
            onClick={() => handleUnlockChat(currentProfile)}
            className="absolute bottom-4 right-4 w-12 h-12 bg-white/95 backdrop-blur-md rounded-full shadow-xl border border-stone-200 flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition"
            title="Like this photo"
          >
            <span className="text-xl text-rose-500">♥</span>
          </div>
        </div>

        {/* Hinge Prompt Card 1 */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 relative">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400 mb-2">
            {currentProfile.prompt1Label}
          </p>
          <h2 className="text-2xl font-serif font-medium text-stone-900 leading-snug">
            "{currentProfile.prompt1Answer}"
          </h2>
          {/* Floating Like Icon */}
          <div
            onClick={() => handleUnlockChat(currentProfile)}
            className="absolute -bottom-4 right-5 w-11 h-11 bg-stone-900 text-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-rose-600 transition hover:scale-105 active:scale-95"
            title="Like this prompt"
          >
            <span className="text-base text-rose-400">♥</span>
          </div>
        </div>

        {/* BLIND AUDIO WARMUP VOICE NOTE PLAYER (Date-NearMe Special) */}
        <div className="bg-gradient-to-r from-rose-500 to-orange-500 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase font-extrabold tracking-widest text-white/80">
              🎙️ Blind Audio Warmup
            </span>
            <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">
              {currentProfile.audioDuration}
            </span>
          </div>

          <p className="text-base font-bold font-serif mb-4">
            "{currentProfile.audioPromptTitle}"
          </p>

          {/* Interactive Voice Waveform */}
          <div className="flex items-center space-x-3 bg-black/20 backdrop-blur-md rounded-2xl p-3">
            <button
              onClick={() => {
                if (playingAudioId === currentProfile.id) {
                  setPlayingAudioId(null);
                } else {
                  setPlayingAudioId(currentProfile.id);
                  toast.success("Playing voice prompt...");
                }
              }}
              className="w-10 h-10 rounded-full bg-white text-rose-600 font-black flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition shrink-0"
            >
              {playingAudioId === currentProfile.id ? "❚❚" : "▶"}
            </button>
            <div className="flex-1 flex items-center space-x-1 h-6">
              {[40, 70, 30, 90, 60, 45, 80, 50, 95, 40, 60, 85, 30, 75, 50].map(
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
        </div>

        {/* Secondary Photo */}
        <div className="w-full h-[450px] rounded-3xl overflow-hidden shadow-md relative bg-stone-200 border border-stone-200">
          <img
            src={currentProfile.img2}
            alt={currentProfile.name}
            className="w-full h-full object-cover"
          />
          <div
            onClick={() => handleUnlockChat(currentProfile)}
            className="absolute bottom-4 right-4 w-12 h-12 bg-white/95 backdrop-blur-md rounded-full shadow-xl border border-stone-200 flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition"
          >
            <span className="text-xl text-rose-500">♥</span>
          </div>
        </div>

        {/* Hinge Prompt Card 2 */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 relative">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400 mb-2">
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

        {/* BOTTOM HINGE FLOATING ACTION CONTROLS */}
        <div className="sticky bottom-20 w-full z-30 flex items-center justify-center space-x-4 py-2">
          {/* Skip / Pass Button */}
          <button
            onClick={handleNextProfile}
            className="w-14 h-14 rounded-full bg-white border border-stone-300 text-stone-600 shadow-xl flex items-center justify-center hover:bg-stone-100 hover:scale-105 active:scale-95 transition text-2xl font-bold"
            title="Pass to next profile"
          >
            ✕
          </button>

          {/* Unlock Chat & Lock Escrow */}
          <button
            onClick={() => handleUnlockChat(currentProfile)}
            className="flex-1 max-w-xs bg-black hover:bg-stone-800 text-white font-extrabold py-4 px-6 rounded-full shadow-2xl flex items-center justify-center space-x-2 transition hover:scale-[1.02] active:scale-95"
          >
            <span className="text-base">🔒 Lock Escrow & Chat</span>
            <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full font-black">
              1 Coin
            </span>
          </button>
        </div>
      </main>

      {/* STORY VIEWER FULLSCREEN MODAL */}
      {viewingStory && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-md">
          <div className="relative w-full max-w-md h-[90vh] rounded-3xl overflow-hidden bg-stone-900 shadow-2xl flex flex-col">
            {/* Top Bar */}
            <div className="absolute top-0 w-full p-4 flex justify-between items-center z-20 bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex items-center space-x-2">
                <img
                  src={viewingStory.img}
                  alt={viewingStory.user}
                  className="w-9 h-9 rounded-full object-cover border-2 border-white"
                />
                <span className="text-white font-bold text-sm">
                  {viewingStory.user}
                </span>
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

      {/* HINGE CLASSIC 5-TAB BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 w-full max-w-lg z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 px-6 py-2.5 flex justify-between items-center shadow-lg">
        {/* Tab 1: Discover */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex flex-col items-center text-stone-900 font-extrabold group"
        >
          <span className="text-2xl leading-none text-rose-500">H</span>
          <span className="text-[10px] font-bold mt-1 text-rose-600">Discover</span>
        </button>

        {/* Tab 2: Standouts */}
        <button
          onClick={() => toast("Standouts refreshed based on your values!", { icon: "⭐" })}
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

        {/* Tab 4: Active Chat */}
        <button
          onClick={() => navigate(`/chat/${currentProfile.id}`)}
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
          <span className="text-[10px] font-medium mt-1">Wallet ({walletBalance})</span>
        </button>
      </nav>
    </div>
  );
};

export default Radar;
