"use client";
import React, { useState, useRef, useEffect } from 'react';
import { IoNotificationsOutline } from "react-icons/io5";
import NotificationCard from './NotificationCard';
import axios from 'axios';

interface NotificationData {
  id: string;
  username: string;
  bio: string;
  profilePic: string;
}

function Notification() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const boxRef = useRef<HTMLDivElement>(null);

  const OpentTheBox = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (userId) { 
          const response = await axios.post('http://localhost:5173/api/requestdata', { userId });
          const notificationsData = Array.isArray(response.data) ? response.data : [];
          setNotifications(notificationsData as NotificationData[]);
          console.log("notifications", notificationsData)

        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative">
   <div
  onClick={OpentTheBox}
  className="relative p-2 rounded-full border-2 border-[#DB1A5A] bg-transparent flex items-center justify-center cursor-pointer h-10 w-10"
>
  <IoNotificationsOutline className="text-2xl text-white" />
  {notifications.length > 0 && (
    <div className="absolute top-0 right-0 h-2 w-2 rounded-full bg-[#DB1A5A]"></div>
  )}
</div>



      {isOpen && (
        <div
          ref={boxRef}
          className="absolute top-12 right-0 mt-2 w-[48vh] h-[60vh] p-6 bg-[#1a1a1a]/95 text-white rounded-lg shadow-lg animate-slide-in"
          style={{ zIndex: 1000 }}
        >
          <h4 className="font-semibold text-lg mb-4">Notifications</h4>
          <p className="text-sm text-gray-300">Here are your latest updates.</p>
          
          <div className="mt-4 space-y-2">
            {notifications.length > 0 ?
            notifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            )): <p className='mt-1 text-[#DB1A5A]'>No Request Yet</p>
          }
          </div>
        </div>
      )}
    </div>
  );
}

export default Notification;

// while(!q.isEmpty()){
//   int a=q.remove();
//   if(a==destination){
//    flag=true;
//     break;
//   }
//   if(!map.containsKey(a)){
//     continue;
//   }
//   List<Integer>list=map.get(a);
//   for(int i=0;i<list.size();i++){
//     if(!visit[list.get(i)]){
//       visit[list.get(i)]=true;
//       q.add(list.get(i));
//     }
//   }
// }