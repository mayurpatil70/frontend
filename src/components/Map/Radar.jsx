import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import toast from "react-hot-toast";

const Radar = () => {
  const [walletBalance, setWalletBalance] = useState(0);
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [viewingStory, setViewingStory] = useState(null);
  const fileInputRef = useRef(null);

  // Prompt user for GPS Location on load
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationAllowed(true);
          toast.success("Location acquired! Finding nearby profiles.");
        },
        (error) => {
          toast.error("Please enable GPS location to find people nearby.");
        },
      );
    }
  }, []);

  const stories = [
    {
      id: 1,
      img: "https://res.cloudinary.com/demo/image/upload/v1689816053/samples/smile.jpg",
      user: "Aisha",
    },
    {
      id: 2,
      img: "https://res.cloudinary.com/demo/image/upload/v1689816056/samples/people/smiling-man.jpg",
      user: "Rahul",
    },
    {
      id: 3,
      img: "https://res.cloudinary.com/demo/image/upload/v1689816054/samples/people/bicycle.jpg",
      user: "Priya",
    },
  ];

  // 11 AI-Generated Dummy Profiles formatted like Hinge cards
  const nearbyUsers = [
    {
      id: 1,
      name: "Archie",
      age: 24,
      pronouns: "she/her",
      distance: "2 km away",
      img1: "https://res.cloudinary.com/demo/image/upload/v1689816053/samples/smile.jpg",
      promptLabel: "Unusual skills",
      promptAnswer:
        "Turning every conversation into a joke and still being kinda cute about it.",
    },
    {
      id: 2,
      name: "Vikram",
      age: 27,
      pronouns: "he/him",
      distance: "5 km away",
      img1: "https://res.cloudinary.com/demo/image/upload/v1689816052/samples/people/jazz.jpg",
      promptLabel: "A shower thought I recently had",
      promptAnswer: "Why do we call it a building if it is already built?",
    },
    {
      id: 3,
      name: "Riya",
      age: 23,
      pronouns: "she/her",
      distance: "1 km away",
      img1: "https://res.cloudinary.com/demo/image/upload/v1689816054/samples/people/bicycle.jpg",
      promptLabel: "I geek out on",
      promptAnswer:
        "Finding the absolute best street food hidden in random alleys.",
    },
    {
      id: 4,
      name: "Kabir",
      age: 28,
      pronouns: "he/him",
      distance: "8 km away",
      img1: "https://res.cloudinary.com/demo/image/upload/v1689816056/samples/people/smiling-man.jpg",
      promptLabel: "My most irrational fear",
      promptAnswer: "That ducks are secretly plotting against us.",
    },
    {
      id: 5,
      name: "Ananya",
      age: 25,
      pronouns: "she/her",
      distance: "3 km away",
      img1: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      promptLabel: "We will get along if",
      promptAnswer:
        "You let me pick the movie but never complain when I fall asleep 10 minutes in.",
    },
    {
      id: 6,
      name: "Arjun",
      age: 26,
      pronouns: "he/him",
      distance: "4 km away",
      img1: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
      promptLabel: "Typical Sunday",
      promptAnswer: "Coffee, ignoring emails, and intense Mario Kart sessions.",
    },
    {
      id: 7,
      name: "Meera",
      age: 24,
      pronouns: "she/her",
      distance: "6 km away",
      img1: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
      promptLabel: "I am looking for",
      promptAnswer:
        "Someone to share dessert with. Actually, just buy me dessert.",
    },
    {
      id: 8,
      name: "Rohan",
      age: 29,
      pronouns: "he/him",
      distance: "12 km away",
      img1: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      promptLabel: "First round is on me if",
      promptAnswer: "You can beat me at rock, paper, scissors.",
    },
    {
      id: 9,
      name: "Neha",
      age: 22,
      pronouns: "she/her",
      distance: "1.5 km away",
      img1: "https://images.unsplash.com/photo-1517841905240-472988babdf9",
      promptLabel: "My simple pleasures",
      promptAnswer: "Fresh bedsheets and perfectly toasted bread.",
    },
    {
      id: 10,
      name: "Samir",
      age: 27,
      pronouns: "he/him",
      distance: "7 km away",
      img1: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6",
      promptLabel: "Two truths and a lie",
      promptAnswer: "I met SRK once, I can juggle, I enjoy pineapple on pizza.",
    },
    {
      id: 11,
      name: "Kritika",
      age: 26,
      pronouns: "she/her",
      distance: "9 km away",
      img1: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df",
      promptLabel: "I want someone who",
      promptAnswer: "Understands that my dog will always come first.",
    },
  ];

  const handleRecharge = () => {
    toast.success("Initiating Razorpay for ₹50 recharge...");
    // Razorpay logic goes here
  };

  const handleStoryUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("media", file);

    const toastId = toast.loading("Uploading story to Cloudinary...");

    try {
      // Get your stored JWT token (adjust according to how you store it after login)
      const token = localStorage.getItem("token");

      const res = await fetch("/api/stories/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Ensure your backend protect middleware can read this
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Story uploaded successfully!", { id: toastId });
        // Optionally, add the new story to your local state here to see it immediately
      } else {
        throw new Error(data.message || "Upload failed");
      }
    } catch (error) {
      toast.error(error.message, { id: toastId });
    }
  };

  const handleUnlockChat = (userName) => {
    if (walletBalance < 1) {
      toast.error("Insufficient balance. Please add ₹50.");
      return;
    }
    setWalletBalance((prev) => prev - 1);
    toast.success(`Chat unlocked with ${userName}!`);
  };

  return (
    <div className="relative h-screen w-full bg-gray-50 overflow-hidden font-sans text-black">
      {/* Clean, Watermark-Free Map Background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={5}
          className="h-full w-full"
          zoomControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </MapContainer>
      </div>

      {/* Top Navigation */}
      <div className="absolute top-0 w-full z-30 bg-white/90 backdrop-blur-md border-b border-gray-200 px-4 py-3 flex justify-between items-center shadow-sm">
        {/* Left: Stories */}
        <div className="flex space-x-3 overflow-x-auto scrollbar-hide items-center">
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={() => fileInputRef.current.click()}
          >
            <div className="w-12 h-12 rounded-full bg-gray-100 border-2 border-dashed border-gray-400 flex items-center justify-center relative">
              <span className="text-xl text-gray-500">+</span>
              <div className="absolute bottom-0 right-0 bg-blue-500 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">+</span>
              </div>
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleStoryUpload}
            className="hidden"
            accept="image/*,video/*"
          />

          {stories.map((story) => (
            <div
              key={story.id}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => setViewingStory(story)}
            >
              <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-purple-500 to-pink-500">
                <img
                  src={story.img}
                  alt="story"
                  className="w-full h-full rounded-full object-cover border-2 border-white"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Right: Wallet & Profile */}
        <div className="flex items-center space-x-3 shrink-0 ml-4">
          <div className="bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200 text-sm font-bold flex items-center">
            <span className="mr-1">🪙</span> {walletBalance}
          </div>
          <button
            onClick={handleRecharge}
            className="bg-black text-white px-3 py-1.5 rounded-full text-xs font-bold hover:bg-gray-800 transition"
          >
            + Add ₹50
          </button>
          {/* Profile Icon */}
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-300 cursor-pointer">
            <img
              src="https://ui-avatars.com/api/?name=User&background=random"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Main Scrolling Feed (Hinge Style Cards) */}
      <div className="absolute top-24 bottom-0 w-full z-10 overflow-y-auto px-4 pb-10 flex flex-col items-center snap-y snap-mandatory">
        {!locationAllowed && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-xl mb-6 w-full max-w-md text-center shadow-sm">
            Please allow GPS access to see people near you.
          </div>
        )}

        {nearbyUsers.map((user) => (
          <div
            key={user.id}
            className="w-full max-w-md mb-12 snap-start shrink-0"
          >
            {/* Header Details */}
            <div className="flex justify-between items-end mb-3 px-1">
              <div>
                <h2 className="text-3xl font-black text-gray-900 leading-none">
                  {user.name}{" "}
                  <span className="text-sm font-normal text-green-600 bg-green-100 px-2 py-0.5 rounded-full align-middle ml-2">
                    ● Active now
                  </span>
                </h2>
                <p className="text-gray-500 text-sm font-medium mt-1">
                  {user.pronouns} •{" "}
                  <span className="text-purple-600 font-semibold">
                    {user.distance}
                  </span>
                </p>
              </div>
              <button className="text-gray-400 hover:text-black font-bold text-xl">
                ...
              </button>
            </div>

            {/* Photo Container */}
            <div className="w-full h-[500px] rounded-3xl overflow-hidden shadow-lg relative bg-white">
              <img
                src={user.img1}
                alt={user.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm p-3 rounded-full cursor-pointer hover:bg-black transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Hinge Prompt Block */}
            <div className="w-full bg-white rounded-2xl shadow-md border border-gray-100 p-6 mt-4 relative">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                {user.promptLabel}
              </p>
              <h3 className="text-2xl font-serif text-gray-900 leading-snug">
                {user.promptAnswer}
              </h3>
              <div className="absolute -bottom-4 right-4 bg-black p-3 rounded-full cursor-pointer shadow-lg hover:bg-gray-800 transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Unlock Chat Button */}
            <button
              onClick={() => handleUnlockChat(user.name)}
              className="mt-8 w-full bg-black text-white font-bold py-4 rounded-full flex justify-center items-center space-x-2 hover:bg-gray-800 transition shadow-xl"
            >
              <span>Unlock Chat for 15 Days</span>
              <span className="bg-white text-black px-2 py-0.5 rounded text-xs font-black">
                ₹1
              </span>
            </button>
          </div>
        ))}
      </div>

      {/* Story Viewer Modal */}
      {viewingStory && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          {/* Story Header */}
          <div className="absolute top-0 w-full p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                <img
                  src={viewingStory.img}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-white font-bold">{viewingStory.user}</span>
            </div>
            <button
              onClick={() => setViewingStory(null)}
              className="text-white text-3xl font-light"
            >
              &times;
            </button>
          </div>
          {/* Story Content */}
          <div className="flex-1 w-full flex items-center justify-center">
            <img
              src={viewingStory.img}
              alt="Story content"
              className="w-full max-w-md max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Radar;
