"use client"
import Sidebar from '../Components/Sidebar'
import { useEffect,useState,useRef } from 'react'
import { io, Socket } from 'socket.io-client';
import MainPart from "../Components/MainPart"
import { useSelector } from '@repo/redux/store';
import Search from '../Components/Search';
import ProtectedRoute from '../Components/ProtectedRoute';

export default function Chat() {
const dark=useSelector((state)=>state.Theme);
  const [online, setOnline] = useState<boolean>(false);
  const [showsearch,setshowsearch]=useState<string|null>(null);
  const [messages, setMessage] = useState<string[]>([]);
  const [sendmessage, setsendmessgae] = useState<string>();
  const [conversationId, setconvid] = useState<string>();
  const [senderId, setsenderId] = useState<string>();
  const[close,setclose]=useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement | null>(null);

  const closeModel = (e:any) => {
    if (searchRef.current === e.target) {
      setshowsearch(null);
    }
  }
  return(
    <ProtectedRoute>
      <div className={`flex flex-col h-screen ${dark?"dark":"light"}`}>
        {showsearch && (
          <div 
          ref={searchRef}
          onClick={closeModel}
          className="absolute top-0 left-0 right-0 z-50 bg-white bg-opacity-30 shadow-lg rounded-lg  border-opacity-18 backdrop-blur-[2px] w-[100%] h-[100%]">
              <Search conversationId={showsearch} />
          </div>
        )}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar close={close} setclose={setclose}/>
          <MainPart close={close} setshowsearch={setshowsearch} showsearch={showsearch}  setOnline={setOnline}/>
        </div>
      </div>
    </ProtectedRoute>
  );
} 