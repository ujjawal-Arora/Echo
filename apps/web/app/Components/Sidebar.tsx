"use client";
import SearchBox from './SearchBox';
import SearchCard from './SearchCard';
import { useEffect, useState } from 'react';
import { LuPanelRightClose } from "react-icons/lu";
import axios from 'axios';

interface Conversation {
  id: string;
  username: string;
  conversationIds: string[];
}

interface SidebarProps {
  close: boolean;
  setclose: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ close, setclose }) => {
  const [data, setData] = useState<Conversation[]>([]);
  const [filteredData, setFilteredData] = useState<Conversation[]>([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response:any = await axios.get(`http://localhost:5173/api/getallconversations/${localStorage.getItem('id')}`);
        console.log("Data fetched:", response.data);
        setData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchConversations();
  }, []);

  return (
    <div
      className={`transition-all duration-300 ease-in-out ${close ? "w-[4%]" : "w-[30%]"} p-4 border-r-2 dark:border-gray-800 border-gray-200 h-screen font-mono dark:bg-[#121212]`}
    >
      {/* Close Button */}
      {close && (
        <div className='cursor-pointer text-xl dark:text-white'>
          <LuPanelRightClose onClick={() => setclose(false)} />
        </div>
      )}

      <div className={`transition-all duration-300 ease-in-out ${close ? "opacity-0 invisible" : "opacity-100 visible"} fixed top-0 left-0 w-[30%] shadow-l z-20 p-4`}>
        <SearchBox setclose={setclose} setData={setFilteredData} data={filteredData}/>
      </div>

      {/* Search Results */}
      <div className={`mt-[8rem] h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar dark:bg-[#121212] ${close ? "opacity-0 invisible" : "opacity-100 visible"} transition-opacity duration-300 ease-in-out`}>
        {data && (filteredData.length ? filteredData : data).map((d:any ,key:any) => (
          <SearchCard
            key={d.id}
            keys={key}
            avatar={null}
            count={20}
            message={"Dummy message"}
            name={d.username}
            date={"Sep 15"}
            conversationId={d.conversationIds[0]}
            userId={d.id}
          />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
