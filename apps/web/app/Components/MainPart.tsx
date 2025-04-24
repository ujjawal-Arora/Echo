"use client"
import Avator from "./Avator"
import { FaSearch } from "react-icons/fa"
import { IoMdSend } from "react-icons/io";
import { MdSunny } from "react-icons/md";
import { IoMdMoon } from "react-icons/io";
import { IoSettingsSharp } from "react-icons/io5";
import { IoMdLock } from "react-icons/io";
import { BsEmojiHeartEyesFill } from "react-icons/bs";
import { useState, KeyboardEvent, useEffect, Dispatch, SetStateAction ,useRef} from "react";
import { io, Socket } from 'socket.io-client';
import { useDispatch, useSelector } from "@repo/redux/store";
import { addDark, removedark } from "@repo/redux/themeslices";
import { clearChatState } from "@repo/redux";
import RightClick from './ChatRightClickContext';
import axios from 'axios';

export default function MainPart({ close, setshowsearch, showsearch, setOnline }: { close: boolean, setshowsearch: Dispatch<SetStateAction<string | null>>, showsearch: string|null, setOnline: Dispatch<SetStateAction<boolean>> }) {
    const [messages, setMessages] = useState<any[]>([]);
    const [pendingMessages, setPendingMessages] = useState<{[key: string]: any[]}>({});
    const state = useSelector((state) => state.Chat);
    const [sendMessage, setsendMessage] = useState<string>();
    const dispatch = useDispatch();
    const dark = useSelector((state) => state.Theme);
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [socket, setsocket] = useState<Socket | null>(null);
    const messageContainerRef = useRef<HTMLDivElement>(null);
    const [userId, setUserId] = useState<string | null>(null);

    // Only clear chat state when explicitly logging out, not on every mount
    // This useEffect is now commented out to prevent clearing on refresh
    /*
    useEffect(() => {
        dispatch(clearChatState());
        setMessages([]);
        setPendingMessages({});
    }, [dispatch]);
    */

    // Get userId from localStorage only on the client side
    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        setUserId(storedUserId);
    }, []);

    // useEffects here
    useEffect(() => {
        const newsocket = io("http://localhost:5173");
        setsocket(newsocket);
        newsocket.on("connect", () => {
            const userId = localStorage.getItem("userId");
            if (!userId) {
                console.error("User ID not found in localStorage");
                return;
            }
            newsocket.emit("connectUser", { userId: userId, socketId: newsocket.id })
            console.log("Connected:", newsocket.id);
            setOnline(true);
        });

        // Add a listener for connection errors
        newsocket.on("connect_error", (error) => {
            console.error("Socket connection error:", error);
        });

        return () => {
            newsocket.disconnect();
            setOnline(false);
        };
    }, []);

    useEffect(() => {
        if (state && state.messages) {
            console.log("Loading messages from Redux state:", state.messages);
            setMessages(state.messages);
            
            // Check if there are any pending messages for this conversation
            if (state.conversationId && pendingMessages[state.conversationId]) {
                console.log("Found pending messages for this conversation:", pendingMessages[state.conversationId]);
                
                // Merge pending messages with current messages, avoiding duplicates
                const currentMessageIds = new Set(state.messages.map((msg: any) => msg.id));
                const newPendingMessages = pendingMessages[state.conversationId]?.filter(
                    (msg: any) => !currentMessageIds.has(msg.id)
                ) || [];
                
                if (newPendingMessages.length > 0) {
                    console.log("Adding pending messages to current conversation:", newPendingMessages);
                    setMessages(prev => [...prev, ...newPendingMessages]);
                }
            }
        } else {
            console.log("No messages in Redux state, fetching from API");
            // If no messages in Redux state, fetch them from the API
            if (state && state.conversationId) {
                fetchMessages(state.conversationId);
            }
        }
    }, [state, pendingMessages]);

    const fetchMessages = async (conversationId: string) => {
        try {
            const response = await axios.get(`http://localhost:5173/api/getmessages/${conversationId}`);
            const responseData = response.data as { success: boolean; data: any[] };
            if (responseData && responseData.success) {
                const messages = responseData.data || [];
                console.log("Fetched messages from API:", messages);
                setMessages(messages);
            } else {
                console.error("Invalid response format:", responseData);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    useEffect(() => {
        const handleReceiveMessage = (message: any) => {
            console.log("Received message:", message);
            
            // Store the message in pendingMessages for this conversation
            setPendingMessages(prev => {
                const conversationId = message.conversationId;
                const existingMessages = prev[conversationId] || [];
                
                // Check if this message is already in the pending messages
                const messageExists = existingMessages.some(msg => msg.id === message.id);
                if (messageExists) {
                    console.log("Message already exists in pending messages, not adding duplicate");
                    return prev;
                }
                
                console.log("Adding new message to pending messages for conversation:", conversationId);
                return {
                    ...prev,
                    [conversationId]: [...existingMessages, message]
                };
            });
            
            // If this message is for the currently selected conversation, add it to the messages state
            if (state && state.conversationId && message.conversationId === state.conversationId) {
                // Check if the message already exists in the state to prevent duplicates
                setMessages((prevMessages) => {
                    // Check if this message is already in the state
                    const messageExists = prevMessages.some(msg => msg.id === message.id);
                    if (messageExists) {
                        console.log("Message already exists in state, not adding duplicate");
                        return prevMessages;
                    }
                    console.log("Adding new message to state");
                    return [...prevMessages, message];
                });
            } else {
                console.log("Message received for a different conversation:", message.conversationId);
            }
        };
        const handleRevisedMessage = (message: any) => {
            console.log("Revised message:", message);
            if (state && state.conversationId && message.conversationId === state.conversationId) {
                setMessages(prevMessages => prevMessages.filter(msg => msg.id !== message.id));
            }
        }
        if (socket) {
            console.log("Socket is connected, listening for messages");
            socket.on('receive-Message', handleReceiveMessage);
            socket.on('revised-Message', handleRevisedMessage);
            return () => {
                console.log("Cleaning up socket listener");
                socket.off('receive-Message', handleReceiveMessage);
                socket.off('revised-Message', handleRevisedMessage);
            };
        }
    }, [socket, state]);

    useEffect(() => {
        if (state && state.conversationId) {
            console.log("Joining conversation room:", state.conversationId);
            socket?.emit("join-conversation", { conversationId: state.conversationId });
            
            return () => {
                console.log("Leaving conversation room:", state.conversationId);
                socket?.emit("leave-conversation", { conversationId: state.conversationId });
            };
        }
    }, [state?.conversationId, socket]);

    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [messages]);
    // functions Here
   

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
            console.log("Sending message:", sendMessage);
            const userId = localStorage.getItem("userId");
            if (!userId) {
                console.error("User ID not found in localStorage");
                return;
            }
            
            if (!state || !state.conversationId) {
                console.error("No conversation ID available");
                return;
            }
            
            if (!state.userId) {
                console.error("No recipient ID available");
                return;
            }
            
            const newMessage = {
                conversationId: state.conversationId,
                senderId: userId,
                body: sendMessage,
                createdAt: new Date().toISOString(),
            };
            
            console.log("Socket ID:", socket?.id);
            console.log("Sending to recipient:", state.userId);
            
            if (!socket) {
                console.error("Socket not connected");
                return;
            }
            
            socket.emit("new-message", { 
                ...newMessage, 
                socketId: socket.id, 
                recieverId: state.userId 
            });
            
            // Clear the input field immediately for better UX
            setsendMessage("");
            
            // Don't add the message to state here - wait for the socket confirmation
            // This prevents duplicate messages
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
    const handleDelete = async (id: string) => {
        if (!state || !state.userId) {
            console.error("No recipient ID available for message deletion");
            return;
        }
        socket?.emit('message-delete', { id: id, recieverId: state.userId });
        setMessages(prevMessages => prevMessages.filter(m => m.id !== id));
    }
    return (
        <div className={`transition-all duration-300 ease-in-out ${dark ? "dark bg-[#121212]" : "light"} ${close ? "w-[100%]" : "w-[70%]"} font-mono relative min-h-screen`}>

            <div className="flex bg-gray-100 p-4 justify-between border-b-2 dark:border-gray-800 dark:bg-[#121212]">
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
                            setshowsearch(state.conversationId)
                        }} ><FaSearch className="text-lg text-[#DB1A5A] cursor-pointer" /></div>
                        <div className="bg-gray-200 pr-5 pl-5 p-3 rounded-lg hover:bg-gray-300 border-2 dark:bg-[#121212] dark:border-[#DB1A5A] dark:hover:bg-[#212121] cursor-pointer"><IoSettingsSharp className="text-lg text-[#DB1A5A] cursor-pointer" /></div>
                    </div>
                </div>
            </div>
            {/* chatting area */}

            <div ref={messageContainerRef} className="flex flex-col h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full">
                        <div className="text-4xl mb-4">👋</div>
                        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">Start a Conversation</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                            Send a message to begin chatting with {state?.name || 'your match'}
                        </p>
                    </div>
                ) : (
                    messages?.map((d: any) => {
                        return (
                            d.id == '1' ? <div className="flex text-[#DB1A5A] font-bold text-sm justify-center mt-4 text-center">
                                <div className="flex dark:bg-[#212121] flex-col pt-2 pb-3 bg-gray-200 pl-2 rounded-l-xl text-base"><IoMdLock /></div>
                                <h1 className="w-[34%] dark:bg-[#212121] pr-2 pb-2 pt-2 rounded-r-xl bg-gray-200 flex">{d.body}</h1>
                            </div> :
                                d.senderId != userId ?
                                    <div key={d.id} className="flex m-6" onContextMenu={handleContextMenu}>
                                        <RightClick
                                            x={menuPosition.x}
                                            y={menuPosition.y}
                                            visible={menuVisible}
                                            onClose={() => handleDelete(d.id)} />
                                        <div className="text-md dark:bg-neutral-700 bg-gray-300 text-black dark:text-white min-w-32 h-fit max-w-[40%] w-fit p-2 pl-4 pr-4 rounded-2xl rounded-bl-none">
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
                    })
                )}
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