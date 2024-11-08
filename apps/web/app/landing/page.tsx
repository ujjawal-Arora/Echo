import FirstPage from "./components/FirstPage"
import SecondPage from "./components/SecondPage"
import ThirdPage from "./components/ThirdPage";
import { IoNotificationsOutline } from "react-icons/io5";
export default function Landing() {
    return (
        <div className="min-h-screen bg-black">
            <TopBar />
            <section>
                <FirstPage />
            </section>
            <section>
                <SecondPage />
            </section>
            <section>
                <ThirdPage />
            </section>
        </div>
    )
}
function TopBar() {
    return (
        <div className="flex  bg-black  text-white justify-between p-2">
            <div className="flex flex-col  justify-center">
                <img src="/Logo.png" className="flex w-50 h-10" />
            </div>
            <div className="flex flex-col justify-center">
                <div className="flex gap-8 font-bold text-lg text-gray-100">
                    <h1 className="hover:text-[#DB1A5A] hover:underline underline-offset-8 cursor-pointer">HOME</h1>
                    <h1 className="hover:text-[#DB1A5A] hover:underline underline-offset-8 cursor-pointer">ABOUT</h1>
                    <h1 className="hover:text-[#DB1A5A] hover:underline underline-offset-8 cursor-pointer">PRICING</h1>
                    <h1 className="hover:text-[#DB1A5A] hover:underline underline-offset-8 cursor-pointer">EXPLORE</h1>
                    <h1 className="hover:text-[#DB1A5A] hover:underline underline-offset-8 cursor-pointer">CHAT</h1>
                </div>
            </div>
            <div className="flex gap-4 p-4">
                <div className="p-2 pr-0 rounded-full border-2 border-[#DB1A5A] bg-transparent flex cursor-pointer h-fit" >
                    <IoNotificationsOutline className="text-2xl text-white" />
                    <div className="h-2 w-2 rounded-full bg-[#DB1A5A] relative right-[30%] top-[100%]"></div>
                </div>
                <button className="text-[#DB1A5A] p-2 bg-transparent border-2 hover:bg-[#DB1A5A] hover:text-gray-100 border-[#DB1A5A] rounded-xl font-bold">SIGN IN</button>
                <button className="bg-[#DB1A5A] p-2 border-2 border-[#DB1A5A] hover:bg-transparent hover:text-[#DB1A5A] text-gray-100 rounded-xl font-bold">SIGN UP</button>
            </div>
        </div>
    )
}