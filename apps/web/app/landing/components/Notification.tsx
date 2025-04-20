"use client";
import React, { useEffect, useState, useRef } from 'react';
import { Bell } from 'lucide-react';
import axios from 'axios';
import io from 'socket.io-client';
import NotificationCard from './NotificationCard';

interface NotificationData {
  id: string;
  username: string;
  bio: string;
  profilePic: string;
}

interface ApiResponse {
  requests: NotificationData[];
}

interface SocketNotification {
  senderId: string;
  senderUsername: string;
  senderProfilePic: string;
  timestamp: string;
}

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const notificationRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      const response = await axios.post<ApiResponse>('http://localhost:5173/api/requestdata', {
        userId: userId
      });

      if (response.data?.requests) {
        setNotifications(response.data.requests);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const socket = io('http://localhost:5173');
    const userId = localStorage.getItem('userId');

    if (userId) {
      socket.emit('connectUser', { userId, socketId: socket.id });
    }

    socket.on('right-swipe-notification', (data: SocketNotification) => {
      const newNotification: NotificationData = {
        id: data.senderId,
        username: data.senderUsername,
        bio: 'Swiped right on you!',
        profilePic: data.senderProfilePic
      };
      setNotifications(prev => [newNotification, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleReject = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const handleAccept = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return (
    <div className="relative" ref={notificationRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-700 transition-colors"
      >
        <Bell className="w-6 h-6 text-white" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-[#1a1a1a] rounded-lg shadow-lg overflow-hidden z-50">
          <div className="p-4">
            <h3 className="text-white font-semibold mb-4">Notifications</h3>
            <div className="space-y-4">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onReject={handleReject}
                    onAccept={handleAccept}
                  />
                ))
              ) : (
                <p className="text-gray-400 text-center">No new requests</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

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