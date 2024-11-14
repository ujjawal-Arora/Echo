import Avator from '../../Components/Avator';
import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; 


interface NotificationCardProps {
  notification: NotificationData;
}

interface NotificationData {
  id: string;
  username: string;
  bio: string;
  profilePic: string;
} 

const NotificationCard: any= ({ notification }:NotificationCardProps) => {
  const router = useRouter();
  const handleAcceptSubmit = async() => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.post('http://localhost:5173/api/deleteReq', {
        reqComeId: notification.id,
        userId: userId,
        Accepted: false,
      });
  
      if (response.data) {
        router.push('/');
      }
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  };
  const handleDeleteSubmit = async() => {
    try {
      const userId=localStorage.getItem('userId');
      const response=await axios.post('',{reqComeId:notification.id,userId:userId,Accepted:false});
      console.log(response)
   
    } catch (error) {
      console.error("Error deleting request:", error);

    }
  };
  return (
    <div className="flex items-center gap-2 justify-between p-4 bg-[#1a1a1a] rounded-lg text-white w-full max-w-sm">
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
        <p className="text-gray-400 text-sm">request to<br></br>follow you</p>
      </div>
      
      <div className="flex gap-2">
        <button onClick={handleAcceptSubmit} className="bg-[#DB1A5A] text-white px-3 py-1 rounded font-medium hover:bg-[#B2164A]">
          Confirm
        </button>
        <button  onClick={handleDeleteSubmit}className="bg-gray-700 text-white px-3 py-1 rounded font-medium hover:bg-gray-800">
          Delete
        </button>
      </div>
    </div>
  );
}

export default NotificationCard;
