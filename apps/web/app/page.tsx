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
    // <div className="flex overflow-hidden">
    //   <Sidebar/>
    //   <MainPart />
    // </div>
    <div className='bg-black  min-h-screen'>
      <div className='flex justify-center place-items-center'>
        <div className={`${online ? "bg-green-500" : "bg-red-700"} text-white  text-5xl p-4 rounded-lg font-mono`} >User {socket && socket.id}</div>
        <input value={conversationId} onChange={(e) => setconvid(e.target.value)} type="text" className='bg-transparent text-white  outline-none border-green-500 border-4 rounded-xl p-4 ml-4 mr-4' placeholder='ConversationId' />
        <input value={senderId} onChange={(e) => setsenderId(e.target.value)} type="text" className='bg-transparent text-white  outline-none border-green-500 border-4 rounded-xl p-4 ml-4 mr-4' placeholder='Sender Id' />
        <input value={sendmessage} onChange={(e) => setsendmessgae(e.target.value)} type="text" className='bg-transparent text-white  outline-none border-green-500 border-4 rounded-xl p-4 ml-4 mr-4' placeholder='body' />
        <button className='text-white bg-black outline-none border-4 border-blue-500 p-4  rounded-xl hover:text-black hover:bg-blue-500 hover:font-bold' onClick={handlesubmit}>Send Message</button>
      </div>
      <div className='flex justify-center place-items-center mt-10'>
        <div>
          {messages && messages.map((msg, index) => (
            <h1 key={index} className='text-white font-bold text-3xl'>{msg}</h1>
          ))}
        </div>
      </div>
    </div>

  );
}
