import { FaSearch } from 'react-icons/fa'; 

function SearchBox() {
  return (
    <div className="flex items-center border-2  rounded-3xl bg-gray-100  border-gray-300 p-3 font-mono">
      <input
        type="text"
        placeholder="Search..."
        className="flex-grow outline-none  border-none bg-transparent text-black"
      />
      <FaSearch className="ml-2  text-xl cursor-pointer text-gray-400" />
    </div>
  );
}

export default SearchBox;
