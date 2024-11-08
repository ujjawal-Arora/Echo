"use client"
import { FaSearch } from 'react-icons/fa';
import Avator from './Avator';
import { BsThreeDots } from "react-icons/bs";
import { LuPanelLeftClose } from "react-icons/lu";
import { Dispatch,SetStateAction, useState ,useEffect} from 'react';

function SearchBox({setclose,setData,data}:{setclose:Dispatch<SetStateAction<boolean>>,setData:any,data:any}) {
  const [search,setsearch]=useState<string>();
  const filtereddata = data?.filter((d: any) => 
    d && d.username && d.username.toLowerCase().includes(search?.toLowerCase())
  );
  useEffect(() => {
    setData(filtereddata && filtereddata.length ? filtereddata : data);
  }, [search])
  return (
    <div>
      <div className='flex justify-between ml-2'>
        <div className='flex gap-4'>
          <Avator name={"Aditya Verma"} width={48} height={48} keys={3} imageUrl={null} isrequired={false} />
          <h1 className='text-lg font-semibold dark:text-white flex-col justify-center flex'>Aditya Verma</h1>
        </div>
        <div className='flex flex-col justify-center text-xl dark:text-white cursor-pointer '>
          <div className='flex gap-4'>
          <BsThreeDots />
          <LuPanelLeftClose onClick={()=>{
            setclose(true)
          }}/>
          </div>
        </div>
      </div>
      <div className="flex items-center border-2  rounded-lg bg-gray-100 border-gray-300 dark:border-[#616161] p-2 font-mono dark:bg-transparent dark:text-white mt-5 ml-4 mr-2">

        <FaSearch className="ml-2 text-xl cursor-pointer text-gray-400 " />
        <input
          type="text"
          placeholder="Search"
          className="flex-grow outline-none  border-none ml-2 bg-transparent text-black dark:text-white"
          onChange={(e)=>setsearch(e.target.value)}
        />
      </div>
    </div>
  );
}

export default SearchBox;
