import Stack from "@/components/ui/stack";

import HomeEvents from "./components/home-events";
import HomeHeader from "./components/home-header";
import Matches from "./components/matches";
import { useEffect } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

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
