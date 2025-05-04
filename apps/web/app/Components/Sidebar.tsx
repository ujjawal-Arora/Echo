"use client";

import { useEffect, useState } from 'react';
import { LuPanelRightClose } from "react-icons/lu";
import { FaSearch } from "react-icons/fa";
import axios from 'axios';
import SearchBox from './SearchBox';
import SearchCard from './SearchCard';
import { io, Socket } from 'socket.io-client';
import { config } from '../config';

interface Conversation {
  id: string;
  username: string;
  conversationIds: string[];
}

interface Notification {
  senderId: string;
  senderUsername: string;
  senderProfilePic: string;
  timestamp: string;
}

interface SidebarProps {
  close: boolean;
  setclose: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ close, setclose }) => {
  const [data, setData] = useState<Conversation[]>([]);
  const [filteredData, setFilteredData] = useState<Conversation[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentUsername, setCurrentUsername] = useState<string>("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Set isClient to true when component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Get current user's username from localStorage
    if (typeof window !== 'undefined') {
      const username = localStorage.getItem('username');
      if (username) {
        setCurrentUsername(username);
      } else {
        // If username is not in localStorage, fetch it from the server
        const userId = localStorage.getItem('userId');
        if (userId) {
          const fetchUsername = async () => {
            try {
              interface UserResponse {
                username: string;
                [key: string]: any;
              }
              
              const response = await axios.get<UserResponse>(`${config.apiBaseUrl}/getuser/${userId}`);
              if (response.data && response.data.username) {
                setCurrentUsername(response.data.username);
                localStorage.setItem('username', response.data.username);
              }
            } catch (error) {
              console.error("Error fetching username:", error);
            }
          };
          
          fetchUsername();
        }
      }
    }
  }, []);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(config.apiBaseUrl.replace('/api', ''));
    setSocket(newSocket);
    
    newSocket.on("connect", () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.warn("User ID not found in localStorage.");
        return;
      }
      newSocket.emit("connectUser", { userId: userId, socketId: newSocket.id });
      console.log("Sidebar connected to socket:", newSocket.id);
    });
    
    // Listen for right-swipe notifications
    newSocket.on('right-swipe-notification', (notification: Notification) => {
      setNotifications(prev => [...prev, notification]);
    });
    
    // Listen for request accepted notifications
    newSocket.on('request-accepted-notification', (data: { conversationId: string }) => {
      console.log("Request accepted notification received:", data);
      // Refresh conversations list
      fetchConversations();
    });
    
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Move fetchConversations outside useEffect so it can be called from other places
  const fetchConversations = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.warn("User ID not found in localStorage.");
        return;
      }

      const response = await axios.get<Conversation[]>(`${config.apiBaseUrl}/get-accepted/${userId}`);
      console.log("✅ Conversations fetched:", response.data);
      console.log("First conversation:", response.data[0]);
      console.log("Conversation IDs:", response.data[0]?.conversationIds);

      setData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error("❌ Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const removeNotification = (index: number) => {
    setNotifications(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className={`bg-gray-100 dark:bg-[#121212] h-screen border-r-2 dark:border-gray-800 transition-all duration-300 ease-in-out ${close ? "w-0 opacity-0" : "w-[30%] opacity-100"}`}>
        <div className={`flex justify-between p-4 border-b-2 dark:border-gray-800 ${close ? "hidden" : "flex"}`}>
          <h1 className="text-xl font-bold dark:text-white">Messages</h1>
          <LuPanelRightClose className="text-2xl cursor-pointer dark:text-white hover:text-gray-400" onClick={() => setclose(true)} />
        </div>
        
        {/* Search Box */}
        <div className={`p-4 ${close ? "hidden" : "block"}`}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSearch className="text-gray-500 dark:text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Notifications</h3>
            {notifications.map((notification, index) => (
              <div key={index} className="bg-white p-3 rounded-lg shadow mb-2 flex items-center justify-between">
                <div className="flex items-center">
                  <img 
                    src={notification.senderProfilePic || '/default-avatar.png'} 
                    alt={notification.senderUsername}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-medium">{notification.senderUsername}</p>
                    <p className="text-sm text-gray-500">Swiped right on you!</p>
                  </div>
                </div>
                <button 
                  onClick={() => removeNotification(index)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* User List */}
        <div className={`overflow-y-auto h-[calc(100vh-12rem)] ${close ? "hidden" : "block"}`}>
          {isClient && (filteredData.length ? filteredData : data).map((user, index) => {
            return (
              <SearchCard
                key={user.id}
                keys={index}
                avatar={null}
                message={"Start chatting!"}
                name={user.username}
                date={"Sep 15"}
                conversationId={user.conversationIds?.[0] || ""}
                userId={user.id}
              />
            );
          })}
        </div>
      </div>
      {close && (
        <button 
          onClick={() => setclose(false)}
          className="fixed left-0 top-1/2 transform -translate-y-1/2 bg-gray-100 dark:bg-[#121212] p-2 rounded-r-lg border-r-2 border-t-2 border-b-2 dark:border-gray-800 shadow-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors z-50"
        >
          <LuPanelRightClose className="text-2xl cursor-pointer dark:text-white rotate-180" />
        </button>
      )}
    </>
  );
};

export default Sidebar;