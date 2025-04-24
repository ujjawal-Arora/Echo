"use client"
import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';
export default function Search({ conversationId }: { conversationId: string | undefined }) {
    const [Messages, setMessages] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [userId, setUserId] = useState<string | null>(null);
    
    console.log("conversation ID", Messages)
    
    useEffect(() => {
        // Get userId from localStorage only on the client side
        const storedUserId = localStorage.getItem("userId");
        setUserId(storedUserId);
        
        const fetchdata = async () => {
            if (conversationId) {
                const data: any = await axios.get(`http://localhost:5173/api/getmessages/${conversationId}`)
                setMessages(data.data.filter((m: any) => m.id !== '1'));
            }
        }
        fetchdata();
    }, [conversationId])
    
    function formatISOToTime(isoString: string) {
        const date = new Date(isoString);
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const suffix = hours >= 12 ? 'p.m.' : 'a.m.';
        hours = hours % 12 || 12;
        const formattedMinutes = minutes.toString().padStart(2, '0');
        return `${hours}:${formattedMinutes} ${suffix}`;
    }
    
    const filteredMessages = Messages.filter((message: any) =>
        message.body.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return (

        <div className='absolute inset-x-0 top-0 dark:bg-[#212121] bg-neutral-300 p-2 rounded-2xl mt-4 z-50 w-[65%] left-[18%]'>
            <div className="flex items-center border-2 rounded-lg dark:bg-[#121212] bg-gray-50 dark:border-[#121212] border-gray-50 p-3 ml-4 mr-4 m-2 mb-4 font-mono mt-2 ">
                <FaSearch className="ml-2 text-xl dark:text-gray-300 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search"
                    className="flex-grow outline-none border-none ml-2 dark:bg-[#121212] bg-gray-50 dark:text-white text-black placeholder:text-black dark:placeholder:text-gray-400 placeholder:font-medium"
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className='max-h-[80vh] overflow-auto transition-all ease-in-out duration-500 bg-gray-50 dark:bg-[#121212] rounded-2xl m-4'>
                {filteredMessages.map((d: any) => (
                    <div key={d.id} className={d.senderId !== userId ? "flex m-6" : "flex justify-end m-6"}>
                        <div className={`text-md ${d.senderId !== userId ? "dark:bg-neutral-700 bg-gray-300 text-black dark:text-white" : "bg-[#DB1A5A] text-white"} min-w-32 h-fit max-w-[40%] w-fit p-2 pl-4 pr-4 rounded-2xl rounded-bl-none`}>
                            {d.body}
                            <h1 className="flex justify-end text-xs mt-1">{formatISOToTime(d.createdAt)}</h1>
                        </div>
                    </div>
                ))}
            </div>
            {/* {search && <div className="dark:bg-[#121212] overflow-auto max-h-[77vh]">
                    
                </div>} */}
        </div>
    );
}
