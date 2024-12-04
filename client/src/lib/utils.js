import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const API_URL = import.meta.env.VITE_APP_API_URL;

export const BORDER_EFFECT =
  "bg-zinc-100 hover:border-zinc-300 border duration-100";

export const BORDER_EFFECT_ACTIVE =
  "bg-zinc-900 border-zinc-900 text-zinc-100 hover:bg-zinc-700 hover:border-zinc-700 duration-100";

export const BORDER_EFFECT_ERROR =
  "bg-red-100 border-red-300 text-red-500 hover:bg-red-200 hover:border-red-400 duration-100";
