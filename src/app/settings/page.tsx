"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { ThemeContext } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useContext } from "react";
import { Check, Moon, Sun } from "lucide-react";
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

  return (
    <MaxWidthWrapper>
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200">
        <h1 className="mb-3 font-bold text-5xl text-gray-900">Settings</h1>
        <Button>Click me</Button>
      </div>

      {/* Theme */}
      <div className="bg-gray-100 rounded-md mt-10 px-6 py-5 border border-gray-300">
        <h2 className="text-xl font-semibold">Theme</h2>
        <p className="text-md text-zinc-700">
          Select a theme to match your style
        </p>

        <div className="mt-7 flex gap-6">
          <Button
            variant="outline"
            size="lg"
            className={cn("bg-white/50 flex items-center gap-3", {
              "ring-2 ring-offset-2 ring-offset-gray-100 ring-opacity-80":
                theme === "light",
              "ring-yellow-300": color === "yellow",
              "ring-orange-400": color === "orange",
              "ring-rose-500": color === "rose",
              "ring-red-500": color === "red",
              "ring-green-500": color === "green",
              "ring-blue-500": color === "blue",
              "ring-violet-500": color === "violet",
            })}
            onClick={() => changeTheme("light")}
          >
            <Sun className="h-5 w-5 text-zinc-700" />
            <p className="text-base font-normal text-zinc-800">Light</p>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className={cn("bg-white/50 flex items-center gap-3", {
              "ring-2 ring-offset-2 ring-offset-gray-100 ring-opacity-80":
                theme === "dark",
              "ring-yellow-300": color === "yellow",
              "ring-orange-400": color === "orange",
              "ring-rose-500": color === "rose",
              "ring-red-500": color === "red",
              "ring-green-500": color === "green",
              "ring-blue-500": color === "blue",
              "ring-violet-500": color === "violet",
            })}
            onClick={() => changeTheme("dark")}
          >
            <Moon className="h-5 w-5 text-zinc-700" />
            <p className="text-base font-normal text-zinc-800">Dark</p>
          </Button>
        </div>
      </div>

      {/* Color preferences */}
      <div className="bg-gray-100 rounded-md mt-10 px-6 py-5 border border-gray-300">
        <h2 className="text-xl font-semibold">Color preferences</h2>
        <p className="text-md text-zinc-700">
          Personalize the experience to suit your needs
        </p>

        <div className="mt-7 flex gap-6">
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger>
                <div
                  className={cn(
                    "h-10 w-10 rounded-full bg-yellow-300 cursor-pointer flex items-center justify-center",
                    {
                      "ring-2 ring-yellow-300 ring-offset-4 ring-offset-gray-100":
                        color === "yellow",
                    }
                  )}
                  onClick={() => changeColor("yellow")}
                >
                  {color === "yellow" && <Check className="h-6 w-6" />}
                </div>
              </TooltipTrigger>
              <TooltipContent className="px-2">Yellow</TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={0}>
              <TooltipTrigger>
                <div
                  className={cn(
                    "h-10 w-10 rounded-full bg-orange-400 cursor-pointer flex items-center justify-center",
                    {
                      "ring-2 ring-orange-400 ring-offset-4 ring-offset-gray-100":
                        color === "orange",
                    }
                  )}
                  onClick={() => changeColor("orange")}
                >
                  {color === "orange" && (
                    <Check className="h-6 w-6 text-white" />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent className="px-2">Orange</TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={0}>
              <TooltipTrigger>
                <div
                  className={cn(
                    "h-10 w-10 rounded-full bg-rose-500 cursor-pointer flex items-center justify-center",
                    {
                      "ring-2 ring-rose-500 ring-offset-4 ring-offset-gray-100":
                        color === "rose",
                    }
                  )}
                  onClick={() => changeColor("rose")}
                >
                  {color === "rose" && <Check className="h-6 w-6 text-white" />}
                </div>
              </TooltipTrigger>
              <TooltipContent className="px-2">Rose</TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={0}>
              <TooltipTrigger>
                <div
                  className={cn(
                    "h-10 w-10 rounded-full bg-red-500 cursor-pointer flex items-center justify-center",
                    {
                      "ring-2 ring-red-500 ring-offset-4 ring-offset-gray-100":
                        color === "red",
                    }
                  )}
                  onClick={() => changeColor("red")}
                >
                  {color === "red" && <Check className="h-6 w-6 text-white" />}
                </div>
              </TooltipTrigger>
              <TooltipContent className="px-2">Red</TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={0}>
              <TooltipTrigger>
                <div
                  className={cn(
                    "h-10 w-10 rounded-full bg-green-500 cursor-pointer flex items-center justify-center",
                    {
                      "ring-2 ring-green-500 ring-offset-4 ring-offset-gray-100":
                        color === "green",
                    }
                  )}
                  onClick={() => changeColor("green")}
                >
                  {color === "green" && (
                    <Check className="h-6 w-6 text-white" />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent className="px-2">Green</TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={0}>
              <TooltipTrigger>
                <div
                  className={cn(
                    "h-10 w-10 rounded-full bg-blue-500 cursor-pointer flex items-center justify-center",
                    {
                      "ring-2 ring-blue-500 ring-offset-4 ring-offset-gray-100":
                        color === "blue",
                    }
                  )}
                  onClick={() => changeColor("blue")}
                >
                  {color === "blue" && <Check className="h-6 w-6 text-white" />}
                </div>
              </TooltipTrigger>
              <TooltipContent className="px-2">Blue</TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={0}>
              <TooltipTrigger>
                <div
                  className={cn(
                    "h-10 w-10 rounded-full bg-violet-500 cursor-pointer flex items-center justify-center",
                    {
                      "ring-2 ring-violet-500 ring-offset-4 ring-offset-gray-100":
                        color === "violet",
                    }
                  )}
                  onClick={() => changeColor("violet")}
                >
                  {color === "violet" && (
                    <Check className="h-6 w-6 text-white" />
                  )}
                </div>
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
