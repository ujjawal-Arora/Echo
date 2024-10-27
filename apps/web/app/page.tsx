"use client"
import Sidebar from './Components/Sidebar'
import { useEffect,useState,useRef } from 'react'
import { io, Socket } from 'socket.io-client';
import MainPart from "./Components/MainPart"
import { useSelector } from '@repo/redux/store';
import Search from './Components/Search';
export default function Home() {
const dark=useSelector((state)=>state.Theme);
  const [online, setOnline] = useState<boolean>(false);
  const [socket, setsocket] = useState<Socket|null>(null);
  const [showsearch,setshowsearch]=useState<boolean>(false);
  const [messages, setMessage] = useState<string[]>([]);
  const [sendmessage, setsendmessgae] = useState<string>();
  const [conversationId, setconvid] = useState<string>();
  const [senderId, setsenderId] = useState<string>();
  const[close,setclose]=useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement | null>(null);
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
  const closeModel = (e:any) => {
    if (searchRef.current === e.target) {
      setshowsearch(false);
    }
  }
  return(
    <div className={`flex overflow-hidden ${dark?"dark":"light"}`}>
     {showsearch && (
        <div 
        ref={searchRef}
        onClick={closeModel}
        className="absolute top-0 left-0 right-0 z-50 bg-white bg-opacity-30 shadow-lg rounded-lg  border-opacity-18 backdrop-blur-[2px] w-[100%] h-[100%]">
            <Search />
        </div>
    )}
      <Sidebar close={close} setclose={setclose}/>
      <MainPart close={close} setshowsearch={setshowsearch} showsearch={showsearch}/>
    </div>
  );
}
