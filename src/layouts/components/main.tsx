import { cn } from "@/lib/utils";
import type { TopbarProps } from "./topbar";
import Topbar from "./topbar";
import ClientProvider from "../client";
import { useEffect, useRef, useState } from "react";

interface Props {
  topbar?: TopbarProps;
  className?: string;
  showNav?: boolean;
  children: React.ReactNode;
}

const MainProvider: React.FC<Props> = ({
  topbar,
  className,
  showNav,
  children,
}) => {
  return (
    <>
      {Boolean(topbar) && <Topbar {...topbar} />}
      <main
        className={cn(
          "bg-accent max-h-dvh h-full",
          Boolean(topbar) && "mt-16 h-[calc(100%-65px)]",
          showNav && "h-[calc(100%-195px)]",
          !Boolean(topbar) && showNav && "h-[calc(100%-90px)]",
          className,
        )}
      >
        <ClientProvider>{children}</ClientProvider>
      </main>
    </>
  );
};

export default MainProvider;
