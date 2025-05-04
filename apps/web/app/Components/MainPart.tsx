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
import dynamic from 'next/dynamic';
import axios from 'axios';
import { config } from '../config';

// Dynamically import RightClick with no SSR
const RightClick = dynamic(() => import('./ChatRightClickContext'), { ssr: false });

export default function MainPart({ close, setshowsearch, showsearch }: { close: boolean, setshowsearch: Dispatch<SetStateAction<string | null>>, showsearch: string|null }) {
    const [messages, setMessages] = useState<any[]>([]);
    const [pendingMessages, setPendingMessages] = useState<{[key: string]: any[]}>({});
    const state = useSelector((state) => state.Chat);
    const [sendMessage, setsendMessage] = useState<string>("");
    const dispatch = useDispatch();
    const dark = useSelector((state) => state.Theme);
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [socket, setsocket] = useState<Socket | null>(null);
    const messageContainerRef = useRef<HTMLDivElement>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Set dark mode as default and handle theme persistence
    useEffect(() => {
        if (isClient && typeof window !== 'undefined') {
            const storedTheme = localStorage.getItem('theme');
            if (storedTheme === 'light') {
                dispatch(removedark());
            } else {
                dispatch(addDark());
                localStorage.setItem('theme', 'dark');
            }
        }
    }, [isClient, dispatch]);

    // Set isClient to true when component mounts (client-side only)
    useEffect(() => {
        setIsClient(true);
        setIsLoading(false);
    }, []);

    // Get userId from localStorage only on the client side
    useEffect(() => {
        if (isClient && typeof window !== 'undefined') {
            const storedUserId = localStorage.getItem("userId");
            setUserId(storedUserId);
        }
    }, [isClient]);

    // Socket connection effect
    useEffect(() => {
        if (isClient && typeof window !== 'undefined') {
            const newsocket = io(config.apiBaseUrl.replace('/api', ''));
            setsocket(newsocket);

            newsocket.on("connect", () => {
                const userId = localStorage.getItem("userId");
                if (!userId) {
                    console.error("User ID not found in localStorage");
                    return;
                }
                newsocket.emit("connectUser", { userId: userId, socketId: newsocket.id });
                console.log("Connected:", newsocket.id);
            });

            newsocket.on("connect_error", (error) => {
                console.error("Socket connection error:", error);
            });

            return () => {
                newsocket.disconnect();
            };
        }
    }, [isClient]);

    // Load messages from Redux state or fetch from API
    useEffect(() => {
        if (isClient && state && state.messages) {
            console.log("Loading messages from Redux state:", state.messages);
            setMessages(state.messages);
            
            if (state.conversationId && pendingMessages[state.conversationId]) {
                const currentMessageIds = new Set(state.messages.map((msg: any) => msg.id));
                const newPendingMessages = pendingMessages[state.conversationId]?.filter(
                    (msg: any) => !currentMessageIds.has(msg.id)
                ) || [];
                
                if (newPendingMessages.length > 0) {
                    setMessages(prev => [...prev, ...newPendingMessages]);
                }
            }
        } else if (isClient && state && state.conversationId) {
            console.log("No messages in Redux state, fetching from API");
            fetchMessages(state.conversationId);
        }
    }, [state, pendingMessages, isClient]);

    // Socket message handling
    useEffect(() => {
        if (!socket || !isClient) return;

        const handleReceiveMessage = (message: any) => {
            console.log("Received message:", message);
            
            setPendingMessages(prev => {
                const conversationId = message.conversationId;
                const existingMessages = prev[conversationId] || [];
                
                if (existingMessages.some(msg => msg.id === message.id)) {
                    return prev;
                }
                
                return {
                    ...prev,
                    [conversationId]: [...existingMessages, message]
                };
            });
            
            if (state?.conversationId === message.conversationId) {
                setMessages(prev => {
                    if (prev.some(msg => msg.id === message.id)) {
                        return prev;
                    }
                    return [...prev, message];
                });
            }
        };

        const handleRevisedMessage = (message: any) => {
            if (state?.conversationId === message.conversationId) {
                setMessages(prev => prev.filter(msg => msg.id !== message.id));
            }
        };

        socket.on('receive-Message', handleReceiveMessage);
        socket.on('revised-Message', handleRevisedMessage);

        return () => {
            socket.off('receive-Message', handleReceiveMessage);
            socket.off('revised-Message', handleRevisedMessage);
        };
    }, [socket, state?.conversationId, isClient]);

    // Add fetchMessages function
    const fetchMessages = async (conversationId: string) => {
        try {
            const response = await axios.get(`${config.apiBaseUrl}/getmessages/${conversationId}`);
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

    // Join conversation room
    useEffect(() => {
        if (state?.conversationId && socket && isClient) {
            socket.emit("join-conversation", { conversationId: state.conversationId });
            return () => {
                socket.emit("leave-conversation", { conversationId: state.conversationId });
            };
        }
    }, [state?.conversationId, socket, isClient]);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [messages]);

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
                id: Date.now().toString(), // Temporary ID
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
            
            // Add message to local state immediately
            setMessages(prev => [...prev, newMessage]);
            
            // Clear the input field
            setsendMessage("");
            
            // Send through socket
            socket.emit("new-message", { 
                ...newMessage, 
                socketId: socket.id, 
                recieverId: state.userId 
            });
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
            localStorage.setItem('theme', 'light');
        } else {
            dispatch(addDark());
            localStorage.setItem('theme', 'dark');
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
            {isLoading ? (
                <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#DB1A5A]"></div>
                </div>
            ) : (
                <>
                    {/* Header */}
                    <div className="flex justify-between p-4 border-b-2 dark:border-gray-800">
                        <div className="flex gap-4">
                            <Avator 
                                name={state?.name} 
                                width={48} 
                                height={48} 
                                keys={state?.keys} 
                                isrequired={true} 
                                imageUrl={null} 
                            />
                            <div className="flex flex-col justify-center">
                                <h1 className="font-bold text-lg dark:text-white">{state?.name}</h1>
                            </div>
                        </div>
                        
                        <div className="flex rounded-lg h-fit gap-1">
                            <div className="bg-gray-200 pl-5 pr-5 p-3 rounded-lg hover:bg-gray-300 border-2 dark:bg-[#121212] dark:border-[#DB1A5A] dark:hover:bg-[#212121] cursor-pointer transition-all duration-500 ease-in-out" onClick={handleDarkToggle}>
                                {dark ? <MdSunny className="text-lg text-[#DB1A5A] cursor-pointer" /> : <IoMdMoon className="text-lg text-[#DB1A5A] cursor-pointer" />}
                            </div>
                            <div className="bg-gray-200 pr-5 pl-5 p-3 rounded-lg hover:bg-gray-300 border-2 dark:bg-[#121212] dark:border-[#DB1A5A] dark:hover:bg-[#212121] cursor-pointer">
                                <IoSettingsSharp className="text-lg text-[#DB1A5A] cursor-pointer" />
                            </div>
                        </div>
                    </div>

                    {/* Chat Area */}
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
                            messages.map((d) => (
                                d.id === '1' ? (
                                    <div key={d.id} className="flex text-[#DB1A5A] font-bold text-sm justify-center mt-4 text-center">
                                        <div className="flex dark:bg-[#212121] flex-col pt-2 pb-3 bg-gray-200 pl-2 rounded-l-xl text-base">
                                            <IoMdLock />
                                        </div>
                                        <h1 className="w-[34%] dark:bg-[#212121] pr-2 pb-2 pt-2 rounded-r-xl bg-gray-200 flex">
                                            {d.body}
                                        </h1>
                                    </div>
                                ) : d.senderId !== userId ? (
                                    <div key={d.id} className="flex m-6" onContextMenu={handleContextMenu}>
                                        {isClient && <RightClick
                                            x={menuPosition.x}
                                            y={menuPosition.y}
                                            visible={menuVisible}
                                            onClose={() => handleDelete(d.id)} />}
                                        <div className="text-md dark:bg-neutral-700 bg-gray-300 text-black dark:text-white min-w-32 h-fit max-w-[40%] w-fit p-2 pl-4 pr-4 rounded-2xl rounded-bl-none">
                                            <h1 className="break-words">{d.body}</h1>
                                            <h1 className="flex justify-end text-xs mt-1">{formatISOToTime(d.createdAt)}</h1>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-end m-6" key={d.id}>
                                        <div className="text-md bg-[#DB1A5A] max-w-[40%] p-2 pl-4 pr-4 rounded-2xl rounded-br-none min-w-32 text-white">
                                            <h1 className="break-words">{d.body}</h1>
                                            <h1 className="flex justify-end text-xs mt-1">{formatISOToTime(d.createdAt)}</h1>
                                        </div>
                                    </div>
                                )
                            ))
                        )}
                    </div>

                    {/* Message Input */}
                    {isClient && state && (
                        <div className="absolute bottom-0 w-full">
                            <div className="flex bg-gray-100 p-3 gap-4 dark:bg-[#121212] border-t-2 dark:border-gray-800 border-gray-200">
                                <div className="flex flex-col justify-center">
                                    <BsEmojiHeartEyesFill className="text-[#DB1A5A] text-2xl" />
                                </div>
                                <input
                                    type="text"
                                    value={sendMessage}
                                    placeholder="Type a message..."
                                    className="w-full h-10 p-2 rounded-lg outline-none dark:text-white dark:placeholder:text-white bg-transparent text-black placeholder:text-black placeholder:font-bold font-semibold"
                                    onKeyDown={handleKeyDown}
                                    onChange={(e) => setsendMessage(e.target.value)}
                                />
                                <div className="flex flex-col justify-center mr-2">
                                    <IoMdSend
                                        className="text-[#ec306f] hover:text-[#DB1A5A] text-3xl cursor-pointer"
                                        onClick={handleSubmit}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
} 