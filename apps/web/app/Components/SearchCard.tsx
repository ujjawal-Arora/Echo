"use client";
import { ReactNode } from 'react';
import Avator from './Avator';
import axios from 'axios';
import { useDispatch } from '@repo/redux/store';
import { addtomainarea } from '@repo/redux/chatslices';

function SearchCard({
  avatar,
  name,
  message,
  date,
  count,
  keys,
  conversationId,
  userId,
}: {
  avatar: string | null;
  name: string;
  message: string;
  date: ReactNode;
  count: number;
  keys: number;
  conversationId: string | undefined;
  userId: string;
}) {
  const dispatch = useDispatch();

  const handleclick = async () => {
    try {
      const response:any = await axios.get(`http://localhost:5173/api/getmessages/${conversationId}`);
      const messages = response.data?. data || [];

      const newdata = {
        messages: messages,
        avatar,
        name,
        keys,
        conversationId,
        userId,
      };

      console.log(newdata);
      dispatch(addtomainarea(newdata));
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
            <div className="text-gray-600 text-sm dark:text-slate-200">{message}</div>
          </div>
          <div className="flex flex-col items-end text-gray-500 text-xs dark:text-gray-200">
            <span>{date}</span>
            <div
              className={`text-white bg-[#DB1A5A] rounded-full flex mt-2 justify-center items-center ${
                count <= 9
                  ? "pr-[0.5rem] pl-[0.5rem] p-[0.1rem]"
                  : count <= 99
                  ? "pr-[0.3rem] pl-[0.3rem] p-[0.2rem]"
                  : "pr-[0.3rem] pl-[0.3rem] p-[0.1rem]"
              }`}
            >
              <h1 className="rounded-full">{count <= 99 ? count : "99+"}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchCard;
