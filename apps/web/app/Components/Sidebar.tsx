"use client"
import SearchBox from './SearchBox';
import SearchCard from './SearchCard';
import { useEffect,useState } from 'react';
import  axios from 'axios';
function Sidebar() {
  const [data,setData]=useState<any>();
  useEffect(()=>{
    console.log("Entered");
    const fetch=async()=>{
      try {
        const data1 = await axios.get("http://localhost:5173/api/getallconversations/f792550a-95a1-4ca3-92d6-7a8ba77369ee");
        console.log("Data fetched:", data1.data);
        setData(data1.data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
    }
    fetch();
  },[])
  return (
    <div className='w-[30%] border h-screen p-4 font-mono'>
      {/* Fixed SearchBox */}

      <div className='fixed top-0 left-0 w-[30%] shadow-l z-20 p-4'>
        <SearchBox />
      </div>

      <div className='mt-[4rem] h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar'>
      {data && data.map((d:any,key:any) => (
        <SearchCard 
            key={d.id} // Unique key
            avatar={null} // Default avatar if none exists
            keys={key} // Replace with actual property
            count={20} // Replace with actual property
            message={"Dummy message"} // Replace with actual property
            name={d.username} // Assuming username property
            date={"Sep 15"} // Assuming date property
            conversationId={d.conversationIds[0]}
        />
    ))}
        {/* {data && data.map((d,key)=>{
          <SearchCard avatar={d.profilePic} keys={key} message={"Dummy message"} name={d.username} date={"Sep 15"} />
        })} */}
        {/* <SearchCard
          avatar={'/img.jpg'}
          keys={10}
          count={44}
          message={"Hello! How are you !!!!"}
          name={"Ujjawal"}
          date={"Sep 15"}
        />
        <SearchCard
          avatar={null}
          keys={4}
          count={44}
          message={"Hello! How are you !!!!"}
          name={"Ujjawal"}
          date={"Sep 15"}
        />
        <SearchCard
          avatar={null}
          keys={2}
          count={44}
          message={"Hello! How are you !!!!"}
          name={"Ujjawal"}
          date={"Sep 15"}
        />
        <SearchCard
          avatar={null}
          keys={9}
          count={44}
          message={"Hello! How are you !!!!"}
          name={"Ujjawal"}
          date={"Sep 15"}
        />
        <SearchCard
          avatar={null}
          keys={6}
          count={44}
          message={"Hello! How are you !!!!"}
          name={"Ujjawal"}
          date={"Sep 15"}
        /><SearchCard
          avatar={null}
          keys={4}
          count={44}
          message={"Hello! How are you !!!!"}
          name={"Ujjawal"}
          date={"Sep 15"}
        /><SearchCard
          avatar={null}
          keys={7}
          count={44}
          message={"Hello! How are you !!!!"}
          name={"Ujjawal"}
          date={"Sep 15"}
        /><SearchCard
          avatar={null}
          keys={8}
          count={44}
          message={"Hello! How are you !!!!"}
          name={"Ujjawal"}
          date={"Sep 15"}
        /><SearchCard
          avatar={null}
          keys={6}
          count={44}
          message={"Hello! How are you !!!!"}
          name={"Ujjawal"}
          date={"Sep 15"}
        /><SearchCard
          avatar={null}
          keys={3}
          count={44}
          message={"Hello! How are you !!!!"}
          name={"Ujjawal"}
          date={"Sep 15"}
        /><SearchCard
          avatar={null}
          keys={4}
          count={44}
          message={"Hello! How are you !!!!"}
          name={"Ujjawal"}
          date={"Sep 15"}
        /> */}
        {/* More SearchCards... */}
      </div>
    </div>
  );
}

export default Sidebar;
