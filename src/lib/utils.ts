import { type ClassValue, clsx } from "clsx";
import { Metadata } from "next";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  // Check if code is running on the client side
  if (typeof window !== "undefined") return path;

  // Check if page is deployed on Vercel
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}${path}`;

  // Otherwise, code is running on the server
  return `http://localhost:${process.env.PORT ?? 3000}${path}`;
}
