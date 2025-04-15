"use client";

import { useEffect, useState } from 'react';
import { LuPanelRightClose } from "react-icons/lu";
import axios from 'axios';
import SearchBox from './SearchBox';
import SearchCard from './SearchCard';
import { io, Socket } from 'socket.io-client';

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
  const [unreadCounts, setUnreadCounts] = useState<{[key: string]: number}>({});
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentUsername, setCurrentUsername] = useState<string>("");
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Get current user's username from localStorage
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
            const response = await axios.get<UserResponse>(`http://localhost:5173/api/user/${userId}`);
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
  }, []);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io("http://localhost:5173");
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
    
    // Listen for new messages
    newSocket.on("receive-Message", (message: any) => {
      console.log("Received message in sidebar:", message);
      if (message && message.conversationId) {
        // Increment unread count for this conversation
        setUnreadCounts(prev => ({
          ...prev,
          [message.conversationId]: (prev[message.conversationId] || 0) + 1
        }));
      }
    });
    
    // Listen for reset unread count event
    newSocket.on("reset-unread-count", (data: any) => {
      console.log("Resetting unread count for conversation:", data.conversationId);
      if (data && data.conversationId) {
        setUnreadCounts(prev => ({
          ...prev,
          [data.conversationId]: 0
        }));
      }
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

      const response = await axios.get<Conversation[]>(`http://localhost:5173/api/get-accepted/${userId}`);
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
    <div
      className={`transition-all duration-300 ease-in-out ${close ? "w-[4%]" : "w-[30%]"} p-4 border-r-2 dark:border-gray-800 border-gray-200 h-screen font-mono dark:bg-[#121212]`}
    >
      {/* Close Icon */}
      {close && (
        <div className='cursor-pointer text-xl dark:text-white'>
          <LuPanelRightClose onClick={() => setclose(false)} />
        </div>
      )}

      {/* Search Box */}
      <div className={`transition-all duration-300 ease-in-out ${close ? "opacity-0 invisible" : "opacity-100 visible"} fixed top-0 left-0 w-[30%] shadow-l z-20 p-4`}>
        <SearchBox
          setclose={setclose}
          setData={setFilteredData}
          data={filteredData}
        />
      </div>

      {/* Current User Info */}
      <div className={`mt-4 mb-4 ${close ? "opacity-0 invisible" : "opacity-100 visible"} transition-opacity duration-300 ease-in-out`}>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold">
            {currentUsername ? currentUsername.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="font-semibold dark:text-white truncate max-w-[150px]">
            {currentUsername || 'User'}
          </div>
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
      <div className={`mt-[4rem] h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar ${close ? "opacity-0 invisible" : "opacity-100 visible"} transition-opacity duration-300 ease-in-out`}>
        {(filteredData.length ? filteredData : data).map((user, index) => {
          // Create a conversation if one doesn't exist
          const createConversation = async () => {
            try {
              const userId = localStorage.getItem('userId');
              if (!userId) {
                console.warn("User ID not found in localStorage.");
                return;
              }
              
              // Check if we already have a conversation with this user
              const existingConversation = data.find(u => 
                u.id === user.id && u.conversationIds && u.conversationIds.length > 0
              );
              
              if (existingConversation) {
                console.log("Conversation already exists for:", user.username);
                return;
              }
              
              console.log("Creating conversation for:", user.username);
              const response = await axios.post('http://localhost:5173/api/linkusers', {
                userId1: userId,
                userId2: user.id
              });
              
              console.log("Created conversation:", response.data);
              
              // Refresh the conversations list
              const updatedResponse = await axios.get<Conversation[]>(`http://localhost:5173/api/get-accepted/${userId}`);
              setData(updatedResponse.data);
              setFilteredData(updatedResponse.data);
            } catch (error) {
              console.error("Error creating conversation:", error);
            }
          };
          
          // If no conversation exists, create one
          if (!user.conversationIds || user.conversationIds.length === 0) {
            createConversation();
          }
          
          return (
            <SearchCard
              key={user.id}
              keys={index}
              avatar={null}
              count={user.conversationIds?.[0] ? (unreadCounts[user.conversationIds[0]] || 0) : 0}
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
  );
};

export default Sidebar;
