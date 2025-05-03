import { IoHeartCircleOutline } from "react-icons/io5";
import { BsEnvelopeHeart } from "react-icons/bs";
import { BsHearts } from "react-icons/bs";

export default function ThirdPage() {
    return (
        <div className=" flex tracking-wide min-h-[100vh] relative overflow-hidden">
<div className="w-[100%] m-14">
    <h1 className="text-[#DB1A5A] flex justify-center font-bold text-4xl">Your Match, Your Conversation – Let’s Talk!</h1>
    <div className="flex justify-center">
    <p className="text-white flex justify-center mt-2 text-sm">Enjoy the security of encrypted chats. Only matched users can send messages, ensuring you're connecting with someone you trust</p>
    </div>
</div>
            <div className="bg-black">
                <img src="/FrontPage7.png" className="w-[35%] absolute -bottom-4 left-56 z-10 overflow-hidden" />
                <img src="/FrontPage8.png" className="w-[35%] absolute bottom-4 right-48 z-10" />
            </div>
            <div className='absolute top-[40%] left-[47%] '>
            <BsEnvelopeHeart className='text-[#DB1A5A] text-7xl'/>
            </div>
            <div className="w-[300px] h-[450px] border-4 rounded-3xl border-[#DB1A5A] absolute bottom-2 right-72 rotate-12 bg-white/15"></div>
            <div className="w-[300px] h-[450px]  border-4 rounded-3xl border-[#DB1A5A] absolute bottom-2 left-72 -rotate-12 bg-white/15"></div>
            <div className='absolute top-[24%] left-[19%] z-20'>
                <BsHearts className='text-[#DB1A5A] text-5xl -rotate-45' />
            </div>
            <div className='absolute top-[24%] right-[19%] z-20'>
                <BsHearts className='text-[#DB1A5A] text-5xl rotate-45 ' />
            </div>
           <div className="absolute top-[40%] left-[5%]">
                <AddOne/>
           </div>
           <div className="absolute bottom-[20%] right-[8%] z-20">
                <AddTwo/>
           </div>
        </div>
    )
}
function AddOne() {
    return (
        <div className="flex gap-2 border-4 p-1 border-[#DB1A5A] bg-[#fccddd] h-fit w-fit rounded-lg pl-2 pr-2">
            {/* <img src="/FrontPage6.png" className="h-[40px] w-[40px] rounded-lg object-cover" /> */}
            <h1 className="text-black flex flex-col justify-center font-bold">Hello How Are You ? </h1>
            <IoHeartCircleOutline className="text-[#DB1A5A] text-4xl"/>
        </div>
    )
}
function AddTwo() {
    return (
        <div className="flex gap-2 border-4 border-[#DB1A5A] bg-[#fccddd] h-fit w-fit rounded-lg pl-2 pr-2 p-1">
            <h1 className="text-black flex flex-col justify-center font-bold">You are really Cute. </h1>
            <IoHeartCircleOutline className="text-[#DB1A5A] text-4xl"/>
        </div>
    )
}