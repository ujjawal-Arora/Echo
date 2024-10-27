import { FaSearch } from 'react-icons/fa';

export default function Search() {
    return (
        <div className='absolute inset-x-0 top-0 dark:bg-[#212121] bg-neutral-300 p-2 rounded-2xl mt-4 z-50 w-[65%] left-[18%]'>
            <div className="flex items-center border-2 rounded-lg dark:bg-[#121212] bg-gray-50 dark:border-[#121212] border-gray-50 p-3 ml-4 mr-4 m-2 mb-4 font-mono mt-2 ">
                <FaSearch className="ml-2 text-xl dark:text-gray-300 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search"
                    className="flex-grow outline-none border-none ml-2 dark:bg-[#121212] bg-gray-50 dark:text-white text-black placeholder:text-black dark:placeholder:text-gray-400 placeholder:font-medium"
                />
            </div>
            <div className='max-h-[80vh] overflow-auto transition-all ease-in-out duration-500 bg-gray-50 dark:bg-[#121212] rounded-2xl m-4'>
                <div className="flex justify-start m-6">
                    <div className="text-md dark:bg-neutral-700 bg-gray-300 text-black dark:text-white min-w-32 h-fit max-w-[40%] w-fit p-2 pl-4 pr-4 rounded-2xl rounded-bl-none">
                        <h1 className="break-words">Today</h1>
                        <h1 className="flex justify-end text-xs mt-1">9:11 p.m.</h1>

                    </div>
                </div>
                <div className="flex justify-end m-6">
                    <div className="text-md bg-[#DB1A5A] max-w-[40%] p-2 pl-4 pr-4 rounded-2xl rounded-br-none min-w-32 text-white">
                        <h1 className="break-words">Today</h1>
                        <h1 className="flex justify-end text-xs mt-1">9:11 p.m.</h1>

                    </div>
                </div>
                <div className="flex justify-end m-6">
                    <div className="text-md bg-[#DB1A5A] max-w-[40%] p-2 pl-4 pr-4 rounded-2xl rounded-br-none min-w-32 text-white">
                        <h1 className="break-words">Today</h1>
                        <h1 className="flex justify-end text-xs mt-1">9:11 p.m.</h1>

                    </div>
                </div>
                <div className="flex justify-start m-6">
                    <div className="text-md dark:bg-neutral-700 bg-gray-300 text-black dark:text-white min-w-32 h-fit max-w-[40%] w-fit p-2 pl-4 pr-4 rounded-2xl rounded-bl-none">
                        <h1 className="break-words">Today</h1>
                        <h1 className="flex justify-end text-xs mt-1">9:11 p.m.</h1>

                    </div>
                </div>
                <div className="flex justify-start m-6">
                    <div className="text-md dark:bg-neutral-700 bg-gray-300 text-black dark:text-white min-w-32 h-fit max-w-[40%] w-fit p-2 pl-4 pr-4 rounded-2xl rounded-bl-none">
                        <h1 className="break-words">Today</h1>
                        <h1 className="flex justify-end text-xs mt-1">9:11 p.m.</h1>

                    </div>
                </div>
                <div className="flex justify-end m-6">
                    <div className="text-md bg-[#DB1A5A] max-w-[40%] p-2 pl-4 pr-4 rounded-2xl rounded-br-none min-w-32 text-white">
                        <h1 className="break-words">Today</h1>
                        <h1 className="flex justify-end text-xs mt-1">9:11 p.m.</h1>

                    </div>
                </div>
                <div className="flex justify-end m-6">
                    <div className="text-md bg-[#DB1A5A] max-w-[40%] p-2 pl-4 pr-4 rounded-2xl rounded-br-none min-w-32 text-white">
                        <h1 className="break-words">Today</h1>
                        <h1 className="flex justify-end text-xs mt-1">9:11 p.m.</h1>

                    </div>
                </div>
                <div className="flex justify-start m-6">
                    <div className="text-md dark:bg-neutral-700 bg-gray-300 text-black dark:text-white min-w-32 h-fit max-w-[40%] w-fit p-2 pl-4 pr-4 rounded-2xl rounded-bl-none">
                        <h1 className="break-words">Today</h1>
                        <h1 className="flex justify-end text-xs mt-1">9:11 p.m.</h1>

                    </div>
                </div>
                <div className="flex justify-start m-6">
                    <div className="text-md dark:bg-neutral-700 bg-gray-300 text-black dark:text-white min-w-32 h-fit max-w-[40%] w-fit p-2 pl-4 pr-4 rounded-2xl rounded-bl-none">
                        <h1 className="break-words">Today</h1>
                        <h1 className="flex justify-end text-xs mt-1">9:11 p.m.</h1>

                    </div>
                </div>
            </div>
        </div>
    );
}
