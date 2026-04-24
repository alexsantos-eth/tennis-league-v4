import { cn } from "@/lib/utils";
import type { TopbarProps } from "./topbar";
import Topbar from "./topbar";
import ClientProvider from "../client";
import { useEffect, useRef, useState } from "react";

interface Props {
  topbar?: TopbarProps;
  className?: string;
  showNav?: boolean;
  showFooter?: boolean;
  children: React.ReactNode;
}

const MainProvider: React.FC<Props> = ({
  topbar,
  className,
  showNav,
  showFooter,
  children,
}) => {
  const mainHeight = !Boolean(topbar) && (showNav || showFooter)
    ? "calc(100% - 90px)"
    : showFooter
      ? "calc(100dvh - 160px)"
      : showNav
        ? "calc(100% - 195px)"
        : Boolean(topbar)
          ? "calc(100% - 65px)"
          : undefined;

  return (
    <>
      {Boolean(topbar) && <Topbar {...topbar} />}
      <main
        style={{ height: mainHeight, marginTop: Boolean(topbar) ? "64px" : undefined }}
        className={cn(
          "bg-accent overflow-scroll h-full",
          className,
        )}
      >
        <ClientProvider>{children}</ClientProvider>
      </main>
    </>
  );
};

export default MainProvider;
