import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isRunningStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches;
}
