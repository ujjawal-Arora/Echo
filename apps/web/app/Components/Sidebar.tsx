"use client";
import SearchBox from './SearchBox';
import SearchCard from './SearchCard';
import { useEffect, useState } from 'react';
import { LuPanelRightClose } from "react-icons/lu";
import axios from 'axios';

function Sidebar({ close, setclose }: { close: boolean, setclose: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [data, setData] = useState<any>();

  useEffect(() => {
    const fetch = async () => {
      try {
        const data1 = await axios.get("http://localhost:5173/api/getallconversations/f792550a-95a1-4ca3-92d6-7a8ba77369ee");
        console.log("Data fetched:", data1.data);
        setData(data1.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetch();
  }, []);

  return (
    <div
      className={`transition-all duration-300 ease-in-out ${close ? "w-[4%] " : "w-[30%] "} p-4 border-r-2 dark:border-gray-800 border-gray-200 h-screen font-mono dark:bg-[#121212]`}
    >
      {/* Close Button */}
      {close && (
        <div className='cursor-pointer text-xl dark:text-white'>
          <LuPanelRightClose onClick={() => setclose(false)} />
        </div>
      )}

      {/* SearchBox */}
      <div className={`transition-all duration-300 ease-in-out ${close ? "opacity-0 invisible" : "opacity-100 visible"} fixed top-0 left-0 w-[30%] shadow-l z-20 p-4`}>
        <SearchBox setclose={setclose} />
      </div>

      {/* Search Results */}
      <div className={`mt-[8rem] h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar dark:bg-[#121212] ${close ? "opacity-0 invisible" : "opacity-100 visible"} transition-opacity duration-300 ease-in-out`}>
        {data && data.map((d: any, key: any) => (
          <SearchCard
            key={d.id}
            avatar={null}
            keys={key}
            count={20}
            message={"Dummy message"}
            name={d.username}
            date={"Sep 15"}
            conversationId={d.conversationIds[0]}
          />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
