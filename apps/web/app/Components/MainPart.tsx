"use client"
import axios from 'axios';
import Avator from "./Avator"
import { FaSearch } from "react-icons/fa"
import { IoMdSend } from "react-icons/io";
import { MdSunny } from "react-icons/md";
import { IoMdMoon } from "react-icons/io";
import { IoSettingsSharp } from "react-icons/io5";
import { BsEmojiHeartEyesFill } from "react-icons/bs";
import { useState, KeyboardEvent, useEffect, Dispatch, SetStateAction } from "react";
import { useDispatch, useSelector } from "@repo/redux/store";
import { addDark, removedark } from "@repo/redux/themeslices";
import RightClick from './ChatRightClickContext';
export default function MainPart({ close, setshowsearch, showsearch }: { close: boolean, setshowsearch: Dispatch<SetStateAction<boolean>>, showsearch: boolean }) {

    const [messages, setMessages] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const state = useSelector((state) => state.Chat);
    const [sendMessage, setsendMessage] = useState<string>();
    const dispatch = useDispatch();
    const dark = useSelector((state) => state.Theme);
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });


    // useEffects here

    useEffect(() => {
        if (state && state.getmessages?.data) {
            setMessages(state.getmessages.data);
        }
    }, [state]);



    // functions Here
    const filteredMessages = messages.filter(message =>
        message.body.toLowerCase().includes(searchQuery.toLowerCase())
    );

    function formatISOToTime(isoString: string) {
        const date = new Date(isoString);
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const suffix = hours >= 12 ? 'p.m.' : 'a.m.';
        hours = hours % 12 || 12;
        const formattedMinutes = minutes.toString().padStart(2, '0');
        return `${hours}:${formattedMinutes} ${suffix}`;
    }
    async function handleSubmit() {
        if (sendMessage && sendMessage.trim()) {
            console.log(sendMessage);
            const newMessage = {
                conversationId: state.conversationId,
                senderId: "f792550a-95a1-4ca3-92d6-7a8ba77369ee",
                body: sendMessage,
                createdAt: new Date().toISOString(),
            };
            const response = await axios.post('http://localhost:5173/api/addconvp', newMessage)
            setMessages(prevMessages => [...prevMessages, newMessage]);
            setsendMessage("");
            console.log(response);
        }
    }
    function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            e.preventDefault();
            console.log(sendMessage);
            handleSubmit();
        }
    }
    function handleDarkToggle() {
        if (dark) {
            dispatch(removedark());
        } else {
            dispatch(addDark());
        }
    }
    const handleContextMenu = (event: any) => {
        event.preventDefault();
        setMenuPosition({ x: event.pageX, y: event.pageY });
        setMenuVisible(true);
    };
    const handleCloseMenu = () => {
        setMenuVisible(false);
    };
    return (
        <div className={`transition-all duration-300 ease-in-out  ${dark ? "dark bg-[#121212]" : "light"} ${close ? "w-[100%]" : "w-[70%]"} font-mono relative min-h-screen`}>

            <div className="flex bg-gray-100 p-4 justify-between border-b-2  dark:border-gray-800 dark:bg-[#121212]">
                <div className=" flex gap-4 ">
                    <Avator name={state?.name} width={48} height={48} keys={state?.keys} isrequired={false} imageUrl={null} />
                    <div className="flex flex-col justify-center">
                        <h1 className="font-bold text-lg dark:text-white">{state?.name}</h1>
                        <div className="flex gap-1">
                            <div className="flex flex-col justify-center">
                                <h2 className="h-2 w-2 bg-[#DB1A5A] rounded-full"></h2>
                            </div>
                            <h1 className="text-slate-600 text-sm dark:text-white">Active</h1>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-center">
                    <div className="flex rounded-lg h-fit gap-1">
                        <div className="bg-gray-200 pl-5 pr-5 p-3  rounded-lg hover:bg-gray-300 border-2 dark:bg-[#121212] dark:border-[#DB1A5A] dark:hover:bg-[#212121] cursor-pointer  transition-all duration-500 ease-in-out" onClick={handleDarkToggle}>
                            {dark ? <MdSunny className="text-lg text-[#DB1A5A] cursor-pointer " /> :
                                <IoMdMoon className="text-lg text-[#DB1A5A] cursor-pointer " />}
                        </div>
                        <div className={`relative transition-all duration-300 ease-in-out ${showsearch ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                        </div>
                        <div className="bg-gray-200 pl-5 pr-5 p-3  rounded-lg hover:bg-gray-300 border-2 dark:bg-[#121212] dark:border-[#DB1A5A] dark:hover:bg-[#212121] cursor-pointer " onClick={() => {
                            setshowsearch(!showsearch)
                        }} ><FaSearch className="text-lg text-[#DB1A5A] cursor-pointer" /></div>
                        <div className="bg-gray-200 pr-5 pl-5 p-3 rounded-lg hover:bg-gray-300 border-2 dark:bg-[#121212] dark:border-[#DB1A5A] dark:hover:bg-[#212121] cursor-pointer"><IoSettingsSharp className="text-lg text-[#DB1A5A] cursor-pointer" /></div>
                    </div>
                </div>
            </div>
            {/* chatting area */}

            <div className="dark:bg-[#121212] overflow-auto max-h-[77vh]" onClick={handleCloseMenu}>
                {messages && messages.map((d: any) => {
                    return (d.senderId != "f792550a-95a1-4ca3-92d6-7a8ba77369ee" ?
                        <div key={d.id} className="flex m-6" >
                            <RightClick
                                x={180}
                                y={110}
                                visible={menuVisible}
                                onClose={handleCloseMenu} />
                            <div className="text-md dark:bg-neutral-700 bg-gray-300 text-black dark:text-white min-w-32 h-fit max-w-[40%] w-fit p-2 pl-4 pr-4 rounded-2xl rounded-bl-none" onContextMenu={handleContextMenu}>
                                <h1 className="break-words">{d.body}</h1>
                                <h1 className="flex justify-end text-xs mt-1">{formatISOToTime(d.createdAt)}</h1>

                            </div>

                        </div> : <div className="flex justify-end m-6" key={d.id}>
                            <div className="text-md bg-[#DB1A5A] max-w-[40%] p-2 pl-4 pr-4 rounded-2xl rounded-br-none min-w-32 text-white">
                                <h1 className="break-words">{d.body}</h1>
                                <h1 className="flex justify-end text-xs mt-1">{formatISOToTime(d.createdAt)}</h1>
                            </div>
                        </div>
                    );
                })}
                {/* {search && <div className="dark:bg-[#121212] overflow-auto max-h-[77vh]">
                    {filteredMessages.map((d: any) => (
                        <div key={d.id} className={d.senderId !== "your-id" ? "flex m-6" : "flex justify-end m-6"}>
                            <div className={`text-md ${d.senderId !== "your-id" ? "dark:bg-neutral-700 bg-gray-300 text-black dark:text-white" : "bg-[#DB1A5A] text-white"} min-w-32 h-fit max-w-[40%] w-fit p-2 pl-4 pr-4 rounded-2xl rounded-bl-none`}>
                                {d.body}
                                <h1 className="flex justify-end text-xs mt-1">{formatISOToTime(d.createdAt)}</h1>
                            </div>
                        </div>
                    ))}
                </div>} */}
            </div>

            {/* Message  send */}

            {state && <div className="absolute bottom-0 w-full ">
                <div className="flex bg-gray-100 p-3 gap-4 dark:bg-[#121212] border-t-2 dark:border-gray-800 border-gray-200">
                    <div className="flex flex-col justify-center">
                        <BsEmojiHeartEyesFill className="text-[#DB1A5A] text-2xl" />
                    </div>
                    <input type="text" value={sendMessage} placeholder="Type a message..." className="w-full h-10 p-2 rounded-lg  outline-none dark:text-white dark:placeholder:text-white bg-transparent text-black placeholder:text-black placeholder:font-bold font-semibold" onKeyDown={handleKeyDown}
                        onChange={(e) => {
                            setsendMessage(e.target.value);
                        }} />
                    <div className="flex flex-col justify-center mr-2" >
                        <IoMdSend className="text-[#ec306f] hover:text-[#DB1A5A] text-3xl cursor-pointer" onClick={handleSubmit} />
                    </div>
                </div>
            </div>
            }
        </div>
    )
} 