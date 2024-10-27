import Lottie from "lottie-react";
import animationData from '../../Bin.json';
export default function RightClick({ x, y, visible, onClose }: { x: any, y: any, visible: boolean, onClose: any }) {
    return (
        <div
            className={`absolute ${visible ? 'block' : 'hidden'} rounded shadow-lg`}
            style={{ left: `${x}px`, top: `${y}px`, zIndex: 1000 }}
            onClick={onClose} 
        >
            <div className="font-mono w-fit h-fit">
                <div className="flex justify-center gap-2 bg-[#212121] p-2 pl-3 pr-3 rounded-lg hover:bg-[#151515] cursor-pointer border-2 border-[#212121]">
                    <div className="w-7 h-7 flex flex-col justify-center place-items-center">
                        <Lottie animationData={animationData} />
                    </div>
                    <h1 className="text-xl font-normal text-red-700 ">Delete</h1>
                </div>
            </div>
        </div>
    )
}