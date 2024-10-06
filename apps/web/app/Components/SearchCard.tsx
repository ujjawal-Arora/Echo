"use client"
import { ReactNode } from 'react';
import Avator from './Avator';
import  axios from 'axios';
import {useDispatch} from '@repo/redux/store';
import { addtomainarea } from '@repo/redux/slices';
function SearchCard({ avatar, name, message, date ,count,keys,conversationId}:{avatar:string|null,name:string,message:string,date:ReactNode,count:number,keys:number,conversationId:string}) {
  const dispatch=useDispatch();
  const handleclick=()=>{
    const fetchmessages=async()=>{
      const getmessages=await axios.get(`http://localhost:5173/api/getmessages/${conversationId}`);
      dispatch(addtomainarea(getmessages))
    }
    fetchmessages();
  }
  return (
    <div className="flex items-center p-4 border-b shadow border-gray-300 gap-4 rounded-md cursor-pointer font-mono" onClick={handleclick}>
     <div>
     <Avator name={name} width={60} height={60} keys={keys} imageUrl={avatar} isrequired={true}/>
     </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-semibold text-md">{name}</div>
            <div className="text-gray-600 text-sm">{message}</div>
          </div>
          <div className="flex flex-col items-end text-gray-500 text-xs">
            <span>{date}</span>
            <div className={`text-white bg-[#DB1A5A] rounded-full flex justify-center place-items-center ${count<=9?"pr-[0.5rem] pl-[0.5rem] p-[0.1rem]":count<=99?"pr-[0.3rem] pl-[0.3rem] p-[0.2rem]":"pr-[0.3rem] pl-[0.3rem] p-[0.1rem]"}`}>
                <h1 className='rounded-full '>{count<=99?count:"99+"}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchCard;
