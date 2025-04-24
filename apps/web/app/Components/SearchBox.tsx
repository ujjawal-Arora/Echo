"use client";

import { FaSearch } from 'react-icons/fa';
import { BsThreeDots } from "react-icons/bs";
import { LuPanelLeftClose } from "react-icons/lu";
import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import Avator from './Avator';

interface Conversation {
  id: string;
  username: string;
  conversationIds: string[];
}

interface SearchBoxProps {
  setclose: Dispatch<SetStateAction<boolean>>;
  setData: Dispatch<SetStateAction<Conversation[]>>;
  data: Conversation[];
}

const SearchBox: React.FC<SearchBoxProps> = ({ setclose, setData, data }) => {
  const [search, setSearch] = useState<string>("");
  const [currentUsername, setCurrentUsername] = useState<string>("");
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true when component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Get current user's username from localStorage
    if (typeof window !== 'undefined') {
      const username = localStorage.getItem('username');
      if (username) {
        setCurrentUsername(username);
      } else {
        // If username is not in localStorage, use a default
        setCurrentUsername('User');
      }
    }
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setData(data);
      return;
    }

    const filtered = data.filter((d) =>
      d.username.toLowerCase().includes(search.toLowerCase())
    );
    setData(filtered);
  }, [search, data, setData]);

  return (
    <div>
      {/* Header */}
      <div className='flex justify-between ml-2'>
        <div className='flex gap-4 mb-14'>
          {/* <Avator name={currentUsername} width={48} height={48} keys={3} imageUrl={null} isrequired={false} /> */}
          {/* <h1 className='text-lg font-semibold dark:text-white flex flex-col justify-center'>{currentUsername}</h1> */}
        </div> 
        <div className='flex flex-col justify-center text-xl dark:text-white cursor-pointer'>
          <div className='flex gap-4'>
            <BsThreeDots />
            <LuPanelLeftClose onClick={() => setclose(true)} />
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="flex items-center border-2 rounded-lg bg-gray-100 border-gray-300 dark:border-[#616161] p-2 font-mono dark:bg-transparent dark:text-white mt-5 ml-4 mr-2">
        <FaSearch className="ml-2 text-xl cursor-pointer text-gray-400" />
        <input
          type="text"
          placeholder="Search"
          value={search}
          className="flex-grow outline-none border-none ml-2 bg-transparent text-black dark:text-white"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchBox;
