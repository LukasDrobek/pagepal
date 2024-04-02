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

// Contruct metadata for the page
export function constructMetadata({
  title = "PagePal",
  description = "PagePal is an open-source software that makes chatting with youd documents easy.",
  image = "/thumbnail.png",
  icons = "/favicon.ico",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      // creator: "",
    },
    icons,
    metadataBase: new URL("https://pagepal-ten.vercel.app"),
    themeColor: "#ffffff",
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
