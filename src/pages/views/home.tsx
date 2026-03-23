import HomeHeader from "./components/home-header";
import HomeEvents from "./components/home-events";
import Matches from "./components/matches";

const Home: React.FC = () => {
  return (
    <>
      <HomeHeader />

      <div className="w-full flex flex-col gap-6 h-full mt-26 py-6 overflow-scroll">
        <HomeEvents />
        <Matches />
      </div>
    </>
  );
};

export default Home;
