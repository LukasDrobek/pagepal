"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { ThemeContext } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useContext, useState } from "react";
import { Check, ChevronsUp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useEffect } from "react";

const Page = () => {
  const { changeTheme, changeColor } = useContext(ThemeContext);

  const { theme, color } = useContext(ThemeContext);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.classList.remove(
      "yellow",
      "orange",
      "rose",
      "red",
      "green",
      "blue",
      "violet"
    );
    document.documentElement.classList.add(color);
  }, [color]);

  type colorType = (
    | "yellow"
    | "orange"
    | "rose"
    | "red"
    | "green"
    | "blue"
    | "violet"
  )[];
  const colors: colorType = [
    "yellow",
    "orange",
    "rose",
    "red",
    "green",
    "blue",
    "violet",
  ];

  return (
    <MaxWidthWrapper>
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200">
        <h1 className="mb-3 font-bold text-5xl text-gray-900">Settings</h1>
        <Button>Click me</Button>
      </div>
      {/* Color preferences */}
      <div className="bg-gray-100/75 rounded-md mt-10 px-6 py-5 border border-gray-300">
        <h2 className="text-xl font-semibold">Color preferences</h2>
        <p className="text-md text-zinc-700">
          Personalize the experience to suit your needs
        </p>

        <div className="mt-7 flex gap-6">
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger>
                <div
                  className="h-8 w-8 rounded-full bg-yellow-300 cursor-pointer"
                  onClick={() => changeColor("yellow")}
                ></div>
              </TooltipTrigger>
              <TooltipContent className="px-2">Yellow</TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={0}>
              <TooltipTrigger>
                <div
                  className="h-8 w-8 rounded-full bg-orange-400 cursor-pointer"
                  onClick={() => changeColor("orange")}
                ></div>
              </TooltipTrigger>
              <TooltipContent className="px-2">Orange</TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={0}>
              <TooltipTrigger>
                <div
                  className="h-8 w-8 rounded-full bg-rose-500 cursor-pointer"
                  onClick={() => changeColor("rose")}
                ></div>
              </TooltipTrigger>
              <TooltipContent className="px-2">Rose</TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={0}>
              <TooltipTrigger>
                <div
                  className="h-8 w-8 rounded-full bg-red-500 cursor-pointer"
                  onClick={() => changeColor("red")}
                ></div>
              </TooltipTrigger>
              <TooltipContent className="px-2">Red</TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={0}>
              <TooltipTrigger>
                <div
                  className="h-8 w-8 rounded-full bg-green-500 cursor-pointer"
                  onClick={() => changeColor("green")}
                ></div>
              </TooltipTrigger>
              <TooltipContent className="px-2">Green</TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={0}>
              <TooltipTrigger>
                <div
                  className="h-8 w-8 rounded-full bg-blue-500 cursor-pointer"
                  onClick={() => changeColor("blue")}
                ></div>
              </TooltipTrigger>
              <TooltipContent className="px-2">Blue</TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={0}>
              <TooltipTrigger>
                <div
                  className="h-8 w-8 rounded-full bg-violet-500 cursor-pointer"
                  onClick={() => changeColor("violet")}
                ></div>
              </TooltipTrigger>
              <TooltipContent className="px-2">Violet</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default Page;
