"use client";
import { ReactNode, useState, useEffect } from 'react';
import Avator from './Avator';
import axios from 'axios';
import { useDispatch } from '@repo/redux/store';
import { addtomainarea } from '@repo/redux/chatslices';
import { io } from 'socket.io-client';
import { config } from '../config';

interface MessageResponse {
  success: boolean;
  data: Array<{
    id: string;
    body: string;
    createdAt: string;
    senderId: string;
  }>;
}

function SearchCard({
  avatar,
  name,
  message,
  date,
  keys,
  conversationId,
  userId,
}: {
  avatar: string | null;
  name: string;
  message: string;
  date: ReactNode;
  keys: number;
  conversationId: string | undefined;
  userId: string;
}) {
  const dispatch = useDispatch();
  const [lastMessage, setLastMessage] = useState<string>("Start chatting!");

  useEffect(() => {
    const fetchLastMessage = async () => {
      if (conversationId) {
        try {
          const response = await axios.get<MessageResponse>(`${config.apiBaseUrl}/getmessages/${conversationId}`);
          if (response.data && response.data.success && response.data.data.length > 0) {
            const messages = response.data.data;
            const lastMsg = messages[messages.length - 1];
            if (lastMsg) {
              setLastMessage(lastMsg.body);
            }
          }
        } catch (error) {
          console.error("Error fetching last message:", error);
        }
      }
    };
    fetchLastMessage();
  }, [conversationId]);

  const handleclick = async () => {
    try {
      if (!conversationId || conversationId === "") {
        console.log("No conversation ID available");
        return;
      }
      
      console.log(`Fetching messages for conversation: ${conversationId}`);
      const response = await axios.get<MessageResponse>(`${config.apiBaseUrl}/getmessages/${conversationId}`);
      
      if (response.data && response.data.success) {
        const messages = response.data.data || [];

        const newdata = {
          messages: messages,
          avatar,
          name,
          keys,
          conversationId,
          userId,
        };

        console.log("Chat data loaded:", newdata);
        dispatch(addtomainarea(newdata));
        
        // Reset unread count by emitting an event
        const socket = io(config.apiBaseUrl.replace('/api', ''));
        socket.emit("conversation-opened", { conversationId });
        socket.disconnect();
      } else {
        console.error("Invalid response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  return (
    <div
      className="flex items-center p-4 border-b shadow dark:border-gray-600 border-gray-300 gap-4 rounded cursor-pointer font-mono"
      onClick={handleclick}
    >
      <div>
        <Avator name={name} width={48} height={48} keys={keys} imageUrl={avatar} isrequired={true} />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-semibold text-md dark:text-white">{name}</div>
            <div className="text-gray-600 text-sm dark:text-slate-200">{lastMessage}</div>
          </div>
          <div className="flex flex-col items-end text-gray-500 text-xs dark:text-gray-200">
            <span>{date}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchCard;
