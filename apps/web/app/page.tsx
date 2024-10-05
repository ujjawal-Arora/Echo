"use client"
import Sidebar from './Components/Sidebar'
import { useEffect,useState } from 'react'
import { io, Socket } from 'socket.io-client';
import MainPart from "./Components/MainPart"
export default function Home() {

  const [online, setOnline] = useState<boolean>(false);
  const [socket, setsocket] = useState<Socket|null>(null);
  const [messages, setMessage] = useState<string[]>([]);
  const [sendmessage, setsendmessgae] = useState<string>();
  const [conversationId, setconvid] = useState<string>();
  const [senderId, setsenderId] = useState<string>();
  const [conversations,setConversation]=useState<any>();
  const handlesubmit = () => {
    console.log("client", sendmessage);
    if (!socket) {
      console.error("Socket is not initialized");
      return;
    }
    if (socket) {
      socket.emit("send message", {conversationId:conversationId,senderId:senderId,body:sendmessage});
      setsendmessgae("");
      
    }
  }
  useEffect(() => {
    const newsocket = io("http://localhost:5173");
    setsocket(newsocket);
    newsocket.on("connect", () => {
      console.log("Connected:", newsocket.id);
      setOnline(true);     
    });

    newsocket.on("new message", (data) => {
      console.log("newmessage", data)
      setMessage((prev) => [...prev, data]);
    })
    return () => {
      newsocket.disconnect();
      setOnline(false);
    };
  }, []);
  return(
    <div className="flex overflow-hidden">
      <Sidebar setConversation={setConversation}/>
      <MainPart conversations={conversations}/>
    </div>
  );
}
