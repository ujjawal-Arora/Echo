"use client"
import { FaSearch } from "react-icons/fa"
import Avator from "./Avator"
import { IoSettingsSharp } from "react-icons/io5";
import RightClick from "./ChatRightClickContext";
import { BsEmojiHeartEyesFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import { useState } from "react";
export default function MainPart() {
    const [rightClickMenu, setRightClickMenu] = useState({ visible: false, x: 0, y: 0 });

    const handleRightClick = (e:any) => {
        e.preventDefault();
        console.log("Right Click");
        setRightClickMenu({
            visible: true,
            x: e.clientX,
            y: e.clientY,
        });
    };
    return (
        <div className="w-[70%] font-mono relative" onContextMenu={handleRightClick}>
            {rightClickMenu.visible && (
                <RightClick x={rightClickMenu.x} y={rightClickMenu.y} />
            )}
            <div className="flex bg-gray-100 p-4 justify-between">
                <div className=" flex gap-4">
                    <Avator name={"Aditya Verma"} width={60} height={60} keys={3} isrequired={false} imageUrl={null} />
                    <div className="flex flex-col justify-center">
                        <h1 className="font-bold text-xl">Aditya Verma</h1>
                        <div className="flex gap-1">
                            <div className="flex flex-col justify-center">
                                <h2 className="h-3 w-3 bg-[#DB1A5A] rounded-full"></h2>
                            </div>
                            <h1 className="text-slate-600">Active</h1>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-center">
                    <div className="flex rounded-lg h-fit ">
                        <div className="bg-gray-200 pl-5 pr-5 p-3  rounded-l-lg hover:bg-gray-300 border-r-2 border-white cursor-pointer "><FaSearch className="text-lg text-[#DB1A5A] cursor-pointer" /></div>
                        <div className="bg-gray-200 pr-5 pl-5 p-3 rounded-r-lg hover:bg-gray-300 cursor-pointer"><IoSettingsSharp className="text-lg text-[#DB1A5A] cursor-pointer" /></div>
                    </div>
                </div>
            </div>
            {/* chatting area */}
            <div></div>
            {/* Message  send */}
            <div className="absolute bottom-0 w-full">
                <div className="flex bg-gray-100 p-3 gap-4">
                    <div className="flex flex-col justify-center">
                        <BsEmojiHeartEyesFill className="text-[#DB1A5A] text-2xl" />
                    </div>
                    <input type="text" placeholder="Type a message..." className="w-full h-10 p-2 rounded-lg  outline-none bg-transparent text-black placeholder:text-black placeholder:font-bold font-semibold" />
                   <div className="flex flex-col justify-center mr-2">
                   <IoMdSend className="text-[#ec306f] hover:text-[#DB1A5A] text-3xl cursor-pointer"/>
                   </div>
                </div>
            </div>
        </div>
    )
} 