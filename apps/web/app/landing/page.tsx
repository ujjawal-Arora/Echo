"use client"
import { useRouter } from "next/navigation"; 
import FirstPage from "./components/FirstPage";
import SecondPage from "./components/SecondPage";
import ThirdPage from "./components/ThirdPage";
import Notification from "./components/Notification";
import Footer from "../Components/Footer";
import toast, { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { useDispatch } from '@repo/redux/store';
import { clearChatState } from '@repo/redux';

export default function Landing() {
    return (
        <div className="min-h-screen bg-[#09090b]">
            <Toaster position="top-center" />
            <TopBar />
            <section>
                <FirstPage />
            </section>
            <section>
                <div className="bg-gradient-to-b from-[#DB1A5A]/20 to-zinc-950">
                <SecondPage />

                </div>
            </section>
            <section>3
                
            <div className="bg-gradient-to-b from-[#09090b] to-[#DB1A5A]/20">

                <ThirdPage />
                </div>
            </section>
            <section>
                <Footer />
            </section>
        </div>
    );
}

function TopBar() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        setIsLoggedIn(!!userId);
    }, []);

    const handleFindMatch = () => {
        if (!isLoggedIn) {
            toast.error('Please login first to find your match!');
            router.push('/signin');
            return;
        }
        router.push('/swipe');
    };

    const handleLogout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('chatState');
        dispatch(clearChatState());
        setIsLoggedIn(false);
        toast.success('Logged out successfully!');
        router.push('/');
    };

    const handleChatClick = () => {
        if (!isLoggedIn) {
            toast.error('Please login first to access chat!');
            router.push('/signin');
            return;
        }
        router.push('/chat');
    };

    const handleExploreClick = () => {
    //     if (!isLoggedIn) {
    //         toast.error('Please login first to explore!');
    //         router.push('/signin');
    //         return;
    //     }
    //     // router.push('/explore');
    };

    const handleAboutClick = () => {
    //     if (!isLoggedIn) {
    //         toast.error('Please login first to view about page!');
    //         router.push('/signin');
    //         return;
    //     }
    //     // router.push('/about');
    };

    return (
        <div className="flex bg-[#121214] shadow-[0_4px_6px_-1px_rgba(255,255,255,0.3)] border-b border-pink-500/30 text-white justify-between p-2">
            <div className="flex flex-col justify-center">
                <img src="/Logo.png" className="flex w-50 h-10" />
            </div>
            <div className="flex flex-col justify-center">
                <div className="flex gap-8 font-bold text-lg text-gray-100">
                    <h1 className="hover:text-[#DB1A5A] hover:underline underline-offset-8 cursor-pointer">HOME</h1>
                    <h1 
                        className="hover:text-[#DB1A5A] hover:underline underline-offset-8 cursor-pointer"
                        onClick={handleAboutClick}
                    >
                        ABOUT
                    </h1>
                    <h1 className="hover:text-[#DB1A5A] hover:underline underline-offset-8 cursor-pointer">PRICING</h1>
                    <h1 
                        className="hover:text-[#DB1A5A] hover:underline underline-offset-8 cursor-pointer"
                        onClick={handleExploreClick}
                    >
                        EXPLORE
                    </h1>
                    <h1 
                        className="hover:text-[#DB1A5A] hover:underline underline-offset-8 cursor-pointer"
                        onClick={handleChatClick}
                    >
                        CHAT
                    </h1>
                </div>
            </div>
            <div className="flex items-center gap-4">
                {isLoggedIn && <Notification />}
                {!isLoggedIn ? (
                    <>
                        <button 
                            onClick={() => router.push("/signin")} 
                            className="text-[#DB1A5A] p-2 bg-transparent border-2 hover:bg-[#DB1A5A] hover:text-gray-100 border-[#DB1A5A] rounded-xl font-bold"
                        >
                            SIGN IN
                        </button>
                        <button 
                            onClick={() => router.push("/signup")}
                            className="bg-[#DB1A5A] p-2 border-2 border-[#DB1A5A] hover:bg-transparent hover:text-[#DB1A5A] text-gray-100 rounded-xl font-bold"
                        >
                            SIGN UP
                        </button>
                    </>
                ) : (
                    <button 
                        onClick={handleLogout}
                        className="text-[#DB1A5A] p-2 bg-transparent border-2 hover:bg-[#DB1A5A] hover:text-gray-100 border-[#DB1A5A] rounded-xl font-bold"
                    >
                        LOGOUT
                    </button>
                )}
                <button 
                    onClick={handleFindMatch}
                    className="bg-[#DB1A5A] p-2 border-2 border-[#DB1A5A] hover:bg-transparent hover:text-[#DB1A5A] text-gray-100 rounded-xl font-bold"
                >
                    FIND YOUR MATCH
                </button>
            </div>
        </div>
    );
}

