"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Card from "./Card";
import { config } from '../config';
import ProtectedRoute from '../Components/ProtectedRoute';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

interface CardData {
  id: number;
  username: string;
  gender: string;
  description: string;
  bio: string;
  profilePic: string;
  interests: string[];
  location: string;
  lookingFor: string[];
  relationshipType: string;
}

function SwipeCards() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    // Check if user details are completed
    const userDetailsCompleted = localStorage.getItem('userDetailsCompleted');
    if (!userDetailsCompleted) {
      toast.error('Please complete your user details first!', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#DB1A5A',
          color: '#fff',
        },
      });
      router.push('/userdetails');
      return;
    }

    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          router.push('/signin');
          return;
        }
  
        console.log("Fetching users with userId:", userId);
        const response = await axios.post(`${config.apiBaseUrl}/sendUser`, {
          userId: userId,
        });
  
        console.log("Response from server:", response.data);
  
        setTimeout(() => {
          if (Array.isArray(response.data)) {
            setCards(response.data as CardData[]);
          } else {
            console.error("Unexpected response format:", response.data);
            setError("Received invalid data format from server");
          }
          setLoading(false);
        }, 3000);
  
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || err.message || "Failed to fetch user data";
        setError(errorMessage);
        console.error("Error fetching users:", err);
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, [router]);
  

  const handleSwipe = (id: number) => {
    setCards((prevCards) => prevCards.filter((card) => card.id !== id));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-zinc-900">
        <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md px-6 py-8 rounded-2xl shadow-lg border border-white/20">
          <div className="relative mb-4">
            <div className="h-12 w-12 border-4 border-pink-300 border-t-transparent rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-pink-400 text-xl animate-pulse">💖</span>
            </div>
          </div>
          <p className="text-white text-sm font-light italic">Finding your special one...</p>
        </div>
      </div>
    );
    
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-900">
        <p className="text-red-400 text-center">{error}</p>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-900">
        <div className=" flex flex-col text-center">
          <p className="text-white text-lg mb-4">No matches found. Check back later!</p>
          <button 
            onClick={() => router.push('/pricing')}
            className="bg-[#DB1A5A] text-white px-6 py-3 rounded-xl font-bold hover:bg-pink-700 transition-colors duration-300"
          >
            Buy Premium for More Matches
          </button>
          <button 
            onClick={() => router.push('/landing')}
            className="bg-zinc-700 mt-5 text-white px-6 py-3 rounded-xl font-bold hover:bg-zinc-600 transition-colors duration-300"
          >Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid h-screen w-full place-items-center bg-zinc-900 overflow-hidden">
      {cards.map((card) => (
        <Card key={card.id} card={card} onSwipe={handleSwipe} />
      ))}
    </div>
  );
}

export default function SwipePage() {
  return (
    <ProtectedRoute>
      <SwipeCards />
    </ProtectedRoute>
  );
}
