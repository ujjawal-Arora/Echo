import Avator from '../../Components/Avator';
import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; 
import io from 'socket.io-client';
import toast, { Toaster } from 'react-hot-toast';
import { config } from '../../config';


interface NotificationCardProps {
  notification: NotificationData;
  onReject?: (id: string) => void;
  onAccept?: (id: string) => void;
}

interface NotificationData {
  id: string;
  username: string;
  bio: string;
  profilePic: string;
}

interface ApiResponse {
  success: boolean;
  conversationId?: string;
  message?: string;
  accepted?: boolean;
}

const NotificationCard: any= ({ notification, onReject, onAccept }:NotificationCardProps) => {
  const router = useRouter();
  const handleAcceptSubmit = async() => {
    const loadingToast = toast.loading('Accepting request...');
    try {
      const response = await axios.post<ApiResponse>(`${config.apiBaseUrl}/deleteReq`, {
        reqComeId: notification.id,
        userId: localStorage.getItem("userId"),
        accepted: true
      });
      
      console.log("Request accepted:", response.data);
      
      // Initialize socket connection
      const socket = io(config.apiBaseUrl.replace('/api', ''));
      
      // Join the conversation room if a conversation was created
      if (response.data.conversationId) {
        socket.emit("join-conversation", { conversationId: response.data.conversationId });
      }
      
      // Notify the other user that their request was accepted
      socket.emit("request-accepted", {
        receiverId: notification.id,
        conversationId: response.data.conversationId
      });
      
      // Disconnect socket after sending notifications
      socket.disconnect();
      
      toast.success('Request accepted successfully!', { id: loadingToast });
      
      // Call the onAccept callback to remove the notification from UI
      if (onAccept) {
        onAccept(notification.id);
      }
      
      // Redirect to chat page
      router.push("/chat");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error accepting request. Please try again.';
      toast.error(errorMessage, { id: loadingToast });
      console.error("Error accepting request:", error);
    }
  };
  
  const handleDeleteSubmit = async() => {
    const loadingToast = toast.loading('Rejecting request...');
    try {
      const response = await axios.post<ApiResponse>(`${config.apiBaseUrl}/deleteReq`, {
        reqComeId: notification.id,
        userId: localStorage.getItem("userId"),
        accepted: false
      });
      
      console.log("Request rejected:", response.data);
      
      // Initialize socket connection
      const socket = io(config.apiBaseUrl.replace('/api', ''));
      
      // Notify the other user that their request was rejected
      socket.emit("request-rejected", {
        receiverId: notification.id
      });
      
      // Disconnect socket after sending notifications
      socket.disconnect();
      
      toast.success('Request rejected successfully!', { id: loadingToast });
      
      // Call the onReject callback to remove the notification from UI
      if (onReject) {
        onReject(notification.id);
      }
      
      // Redirect to landing page
      router.push("/landing");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error rejecting request. Please try again.';
      toast.error(errorMessage, { id: loadingToast });
      console.error("Error rejecting request:", error);
    }
  };
  
  return (
    <div className="flex items-center gap-2 justify-between p-4 bg-[#1a1a1a] rounded-lg text-white w-full max-w-sm">
      <Toaster position="top-center" />
      <Avator
        name={notification.username}
        width={45}
        height={45}
        keys={2}
        imageUrl={notification.profilePic}
        isrequired={false}
      />
      
      <div className="flex-1">
        <p className="font-semibold">{notification.username}</p>
        <p className="text-gray-400 text-sm">{notification.bio}</p>
      </div>
      
      <div className="flex gap-2">
        <button onClick={handleAcceptSubmit} className="bg-[#DB1A5A] text-white px-3 py-1 rounded font-medium hover:bg-[#B2164A]">
          Accept
        </button>
        <button onClick={handleDeleteSubmit} className="bg-gray-700 text-white px-3 py-1 rounded font-medium hover:bg-gray-800">
          Reject
        </button>
      </div>
    </div>
  );
}

export default NotificationCard;
