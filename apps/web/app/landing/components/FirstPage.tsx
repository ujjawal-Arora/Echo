import LikedButton from '@repo/ui/LikedButton'
// import { BsArrowThroughHeartFill } from "react-icons/bs";
// import { BsBalloonHeartFill } from "react-icons/bs";
import { BsHearts } from "react-icons/bs";
import { useRouter } from 'next/navigation';

export default function FirstPage() {
    const router = useRouter();
    return (
        <div className="bg-zinc-900  flex tracking-wide min-h-[90vh] bg-gradient-to-b from-[#DB1A5A]/20 to-zinc-950">
                        {/* <div className="absolute inset-0 bg-gradient-to-b from-[#DB1A5A]/20 to-zinc-950" /> */}

            <div className='text-white z-40 w-[66%] mt-20'>
                <h1 className='text-5xl flex justify-start mt-16 ml-16 mr-16 font-bold text-[#DB1A5A]'>Real People. Real Connections. Real Love.</h1>
                <h2 className='flex ml-16 mr-20 mt-4 text-xl'>Join today and take the first step toward finding someone who shares your passions and values. Love might be closer than you think—start your journey now!</h2>
                <button onClick={() => router.push('/signup')} className='bg-[#DB1A5A] p-2 pl-3 pr-3 rounded-xl border-[#DB1A5A] hover:text-[#DB1A5A] font-bold text-lg hover:bg-transparent border-2 ml-16 mt-6'>Create an Account</button>
            </div>
            <div className="flex justify-end bg-black">
                <img src="/FrontPage.png" className="w-[35%] absolute bottom-10 right-10 z-10" />
            </div>
            <div className="w-[250px] h-[450px] border-4 rounded-3xl border-[#DB1A5A] absolute bottom-8 right-72"></div>
            <div className="w-[250px] h-[450px]  border-4 rounded-3xl border-[#DB1A5A] absolute bottom-8 right-2"></div>
            <div className='absolute bottom-12 right-80 z-20'>
                <LikedButton />
            </div>
            <div className='absolute bottom-12 right-32 z-20'>
                <LikedButton />
            </div>
            <div className='absolute top-[18%] left-[55%] z-20'>
                <BsHearts className='text-[#DB1A5A] text-5xl -rotate-45' />
            </div>
            <div className='absolute top-[17%] right-[3%] z-20'>
                <BsHearts className='text-[#DB1A5A] text-5xl rotate-45 ' />
            </div>
        </div>
    )
}