import SearchBox from './SearchBox';
import SearchCard from './SearchCard';
function Sidebar() {
  return (
    <div className='w-[30%] border h-screen p-4 font-mono'>
      {/* Fixed SearchBox */}

      <div className='fixed top-0 left-0 w-[30%] shadow-l z-20 p-4'>
        <SearchBox />
      </div>

      <div className='mt-[4rem] h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar'>

        <SearchCard
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
        />
        {/* More SearchCards... */}
      </div>
    </div>
  );
}

export default Sidebar;
