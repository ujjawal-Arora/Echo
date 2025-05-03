import { BsHearts } from "react-icons/bs";
import { TiTick } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
export default function SecondPage() {
    return (
        <div className="bg-zinc-950">
            <h1 className="text-[#DB1A5A] text-4xl flex justify-center mt-10 font-bold">Start Connecting with Just a Swipe!</h1>
            <p className="text-white mt-2 flex justify-center">Want to meet someone new? Simply swipe right to send a connection request. </p>
            <p className="text-white mt-2 flex justify-center">If they swipe right too, the conversation begins—safe, simple, and secure!</p>
            <div className="flex min-h-screen justify-center items-center space-x-6 relative">
                <div className="w-[70%] flex justify-center mt-10 gap-10">
                    <div className="border-4 border-[#DB1A5A] rounded-2xl w-fit">
                        <img src="/FrontPage3.png" className="rounded-3xl p-2" />
                    </div>
                    <div className="absolute top-[6%] left-[3%]">
                        <AddOne />
                    </div>
                    <div className="absolute top-[50%] left-[43%]">
                        <AddTwo />
                    </div>
                    {/* <h1 className="flex text-4xl absolute top-[15%] left-[45%] font-bold text-white">HIT WORKS ?</h1> */}
                </div>
                <div className="w-[40%]">
                    <div className="absolute top-10 right-16">
                        <Ballon image="/FrontPage4.png" title="Ideal Relationship" para="Building trust, love, and understanding." />
                    </div>
                    <div className="absolute top-[40%]">
                        <Ballon image="/FrontPage5.png" title="Perfect Match" para="Finding someone who complements you perfectly." />
                    </div>
                </div>
            </div>
        </div>
    );
}

function Ballon({ image, title, para }: { image: string; title: string; para: string }) {
    return (
        <div className="bg-white/15 border-4 border-[#DB1A5A]  rounded-full w-[200px] h-[300px] p-4 flex flex-col items-center justify-center shadow-lg space-y-2">            
        <div className="w-[150px] h-[150px] bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 rounded-full overflow-hidden">
            <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
            <h2 className="text-xl font-semibold text-center text-[#DB1A5A]">{title}</h2>
            <p className="text-sm font-medium text-center text-white">{para}</p>
        </div>
    );
}
function AddOne() {
    return (
        <div className="flex gap-2 border-2 border-[#DB1A5A] bg-white/25 h-fit w-fit rounded-lg pl-2 pr-2 p-1">
            <img src="/FrontPage6.png" className="h-[40px] w-[40px] rounded-lg object-cover" />
            <h1 className="text-white flex flex-col justify-center font-bold">Sent you a friend request!</h1>
            <TiTick className="text-green-500 text-4xl" />
            <IoClose className="text-red-500 text-3xl mt-1" />
        </div>
    )
}
function AddTwo() {
    return (
        <div className="flex gap-2 border-2 border-green-500 bg-white/30 h-fit w-fit rounded-lg pl-2 pr-2 p-1">
            <TiTick className="text-green-500 text-4xl" />
            <h1 className="text-white flex flex-col justify-center font-bold">Request sent successfully!</h1>
        </div>
    )
}

