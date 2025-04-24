import React, { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { io } from "socket.io-client";
import axios from 'axios';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai'
import toast, { Toaster } from 'react-hot-toast';
import { config } from '../config';

interface CardProps {
  card: {
    id: number;
    username: string;
    gender: string;
    description: string;
    interests: string[];
    bio: string;
    profilePic: string;
    lookingFor: string[];
  relationshipType: string;
    location: string;
  };
  onSwipe: (id: number) => void;
}

const Card = ({ card, onSwipe }: CardProps) => {
  const [boxShadow, setBoxShadow] = useState("0px 10px 30px rgba(0, 0, 0, 0.2)");
  const [showSticker, setShowSticker] = useState("");
  const [showPopup, setShowPopup] = useState(false);
// console.log("card at swipe",card.bio)
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-150, 150], [-20, 20]);
  const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0]);

  const handleMouseMove = (event: React.MouseEvent) => {
    const { offsetX, target } = event.nativeEvent;
    const cardWidth = (target as HTMLDivElement).offsetWidth;

    if (offsetX < cardWidth / 2) {
      setBoxShadow("0px 10px 30px rgba(255, 0, 0, 0.5)");
      setShowSticker("like");
    } else {
      setBoxShadow("0px 10px 30px rgba(0, 255, 0, 0.5)");
      setShowSticker("dislike");
    }
  };

  const handleMouseLeave = () => {
    setBoxShadow("0px 10px 30px rgba(0, 0, 0, 0.2)");
    setShowSticker("");
  };

  const handleDragEnd = async (event: any, info: any) => {
    if (info.offset.x > 100) {
      await handleSwipeRight(); 

      onSwipe(card.id); // Right swipe
      resetCard();
    } else if (info.offset.x < -100) {
      onSwipe(card.id); // Left swipe
      resetCard();
    } else {
      resetCard();
    }
  };

  // Function to reset the card position
  const resetCard = () => {
    x.set(0);
  };

  // Function to handle swiping left
  const handleSwipeLeft = () => {
    x.set(-300); // Move left
    onSwipe(card.id); // Call the swipe function
  };

  // Function to handle swiping right
  const handleSwipeRight = async() => {
    const loadingToast = toast.loading('Sending friend request...');
    x.set(300); // Move right
    onSwipe(card.id); // Call the swipe function
    try {
      const userId = localStorage.getItem('userId');
      
      // Send friendship request to the backend
      const response = await axios.post(`${config.apiBaseUrl}/sendreq`, { 
        senderId: userId,
        receiverId: card.id
      });
      console.log("Swiped right:", (response.data as { message: string }).message);
      
      // Emit socket event for right-swipe notification
      const socket = io(config.apiBaseUrl.replace('/api', ''));
      socket.emit("right-swipe", {
        senderId: userId,
        receiverId: card.id
      });
      console.log("Right-swipe notification sent");
      
      // Disconnect socket after sending notification
      setTimeout(() => {
        socket.disconnect();
      }, 1000);

      toast.success('Friend request sent successfully!', { id: loadingToast });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error sending friend request. Please try again.';
      toast.error(errorMessage, { id: loadingToast });
      console.error("Error swiping right:", error);
    }
  }

  return (
    <>
      <div className="flex justify-center items-center h-screen gap-11">
        <Toaster position="top-center" />
        {/* Card */}
        <motion.div
          className="relative justify-between bg-blue-900 z-50 items-center text-white h-[80vh] w-[50vh] rounded-2xl p-6 text-center border border-gray-700 shadow-xl"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            x, // Dragging motion
            rotate, // Card rotation
            opacity, // Card opacity fade
            boxShadow, // Apply dynamic box shadow
          }}
        >
          <div
            className="absolute inset-0 rounded-2xl bg-cover bg-center"
            style={{
              backgroundImage: `url(${card.profilePic})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          <div className="relative z-10 flex flex-col justify-between items-center h-full w-full">
            {showSticker === "like" && (
              <div className="absolute top-2 left-2 flex items-center justify-center w-16 h-16 rounded-full">
                {/* <span className="text-white text-lg">💔</span> */}
              </div>
            )}
            {showSticker === "dislike" && (
              <div className="absolute top-2 right-2 flex items-center justify-center w-16 h-16 rounded-full">
                {/* <span className="text-white text-lg">❤️</span> */}
              </div>
            )}

            {/* Bottom Content */}
            <div className="bg-black bg-opacity-60 w-full py-4 rounded-lg text-left px-6 mt-auto">
              <div className="text-xl font-bold">{`${card.username} `}</div>
              <div className="text-sm text-gray-300">{card.gender}</div>
              <div className="mt-2 text-gray-400 text-sm flex items-center">
                <span className="truncate">{card.bio}</span>
                <button
                  className="ml-2 text-sm text-red-600 hover:text-red-400 font-semibold whitespace-nowrap"
                  onClick={() => setShowPopup(true)} // Open side panel
                >
                  More
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Popup Panel */}
        {showPopup && (
  <motion.div
    className="relative bg-transparent w-[60vh] h-[70vh] p-6 shadow-lg rounded-lg border border-gray-700 flex flex-col overflow-y-auto"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: "tween", duration: 0.4 }}
  >
    {/* Close Button */}
    <button
      className="absolute top-4 right-4 text-gray-400 hover:text-pink-400 transition duration-300"
      onClick={() => setShowPopup(false)}
    >
      ✕
    </button>

    <h2 className="text-3xl px-4 font-bold text-pink-500 mb-1">
      {card.username}
    </h2>
    <p className="text-lg px-4 font-medium text-gray-300 mb-4">{card.gender}</p>

    <p className="text-md font-medium px-3 text-gray-400 mb-4">
      📍 {card.location}
    </p>

    <div className="mb-4 px-4">
      <h3 className="text-lg font-semibold text-gray-200 mb-2">About</h3>
      <p className="text-gray-400 leading-relaxed">{card.bio}</p>
    </div>

    <div className="mb-4 px-4">
      <h3 className="text-lg font-semibold text-gray-200 mb-2">Looking For</h3>
      <p className="text-gray-400 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-pink-500 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10 2a1 1 0 00-1 1v7H2a1 1 0 000 2h7v7a1 1 0 002 0v-7h7a1 1 0 000-2h-7V3a1 1 0 00-1-1z" />
        </svg>
        {card.lookingFor}
      </p>
    </div>

    <div className="mb-4 px-4">
      <h3 className="text-lg font-semibold text-gray-200 mb-2">Relationship Type</h3>
      <p className="text-gray-400 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-pink-500 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M3 4a1 1 0 00-1 1v1a1 1 0 001 1h1v1a1 1 0 002 0v-1h1a1 1 0 000-2H5V5a1 1 0 00-1-1H3zm4 9a1 1 0 00-1 1v1a1 1 0 001 1h1v1a1 1 0 002 0v-1h1a1 1 0 000-2H7v-1a1 1 0 00-1-1H7z" />
        </svg>
        {card.relationshipType}
      </p>
    </div>

    <div className="w-full mt-4 px-4">
      <h3 className="text-lg font-semibold text-gray-200 mb-2">Interests</h3>
      <div className="flex flex-wrap gap-2 justify-center">
        {card.interests.map((interest: any, index: any) => (
          <span
            key={index}
            className="bg-pink-700 text-pink-200 px-3 py-1 rounded-full text-sm font-medium shadow-md transition-transform transform hover:scale-105"
          >
            {interest}
          </span>
        ))}
      </div>
    </div>

    {/* Swipe Buttons */}
    <div className="flex justify-between mt-6">
      <button
        className="bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-600 transition duration-300 flex items-center shadow-lg"
        onClick={handleSwipeLeft} // Call swipe left function
      >
              <AiOutlineLeft className="h-5 w-5 mr-2" />

        Swipe Left
      </button>
      <button
        className="bg-green-500 text-white py-2 px-4 rounded-full hover:bg-green-600 transition duration-300 flex items-center shadow-lg"
        onClick={handleSwipeRight} // Call swipe right function
      >
       
        Swipe Right
        <AiOutlineRight className="h-5 w-5 mr-2" />

      </button>
    </div>
  </motion.div>
)}

      </div>
    </>
  );
};

export default Card;
