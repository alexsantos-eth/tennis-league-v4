import HomeHeader from "./components/home-header";
import HomeEvents from "./components/home-events";
import Matches from "./components/matches";

const Home: React.FC = () => {
  return (
    <div className="h-full pt-32 overflow-scroll pb-6 flex flex-col gap-6">
      <HomeHeader />
<HomeEvents />
        <Matches />
    </div>
  );
};

export default Home;
