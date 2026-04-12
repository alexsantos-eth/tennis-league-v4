import Stack from "@/components/ui/stack";

import HomeEvents from "./components/home-events";
import HomeHeader from "./components/home-header";
import Matches from "./components/matches";

const Home: React.FC = () => {
  return (
    <Stack className="h-full pt-32 overflow-scroll pb-6" noPx>
      <HomeHeader />
      <HomeEvents />
      <Matches />
    </Stack>
  );
};

export default Home;
