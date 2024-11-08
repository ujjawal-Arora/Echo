import { FaShieldHeart } from "react-icons/fa6";
export default function LikedButton(){
    return (
        <div className="text-white w-fit h-fit flex border-2 border-[#DB1A5A] p-2 rounded-xl gap-2 bg-white/10  backdrop-blur-0 border-white/18">
            <FaShieldHeart className="text-[#DB1A5A] text-2xl flex flex-col justify-center "/>
            <h1 className="text-xl font-bold ">Liked</h1>
        </div>
    )
}