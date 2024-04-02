"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  ArrowRight,
  FilePieChart,
  Gem,
  LogIn,
  LogOut,
  Menu,
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MobileNav = ({ isAuth }: { isAuth: boolean }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleIsOpen = () => setIsOpen((prev) => !prev);

  const pathName = usePathname();

  useEffect(() => {
    if (isOpen) toggleIsOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathName]);

  const closeOnCurrentPage = (href: string) => {
    pathName === href && toggleIsOpen();
  };

  // Continue here 10:40:14

  return (
    <div className="sm:hidden">
      <Menu
        onClick={toggleIsOpen}
        className="relative z-50 h-5 w-5 text-zinc-700"
      />

      {isOpen && (
        <div className="fixed animate-in slide-in-from-top-5 fade-in-20 inset-0 z-0 w-full">
          <ul className="absolute bg-white border-b border-zinc-200 shadow-xl grid w-full gap-1 px-10 pt-20 pb-8">
            {!isAuth ? (
              <>
                <li>
                  <Link
                    onClick={() => closeOnCurrentPage("/sign-up")}
                    href="/sign-up"
                    className={buttonVariants({
                      size: "sm",
                      className:
                        "flex items-center justify-between w-full text-green-600",
                    })}
                  >
                    <p className="text-base text-white">Get started</p>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </li>

                {/* Visual separator */}
                <li className="my-3 h-px w-full bg-gray-300" />

                <li>
                  <Link
                    onClick={() => closeOnCurrentPage("/sign-in")}
                    href="/sign-in"
                    className={buttonVariants({
                      size: "sm",
                      variant: "ghost",
                      className: "flex items-center justify-between w-full",
                    })}
                  >
                    <p className="text-base">Sign in</p>
                    <LogIn className="h-5 w-5 text-zinc-600" />
                  </Link>
                </li>

                {/* FIX: Why is this separator rendered so thin? */}
                {/* Visual separator */}
                <li className="my-3 h-px w-full bg-gray-300" />

                <li>
                  <Link
                    onClick={() => closeOnCurrentPage("/pricing")}
                    href="/pricing"
                    className={buttonVariants({
                      size: "sm",
                      variant: "ghost",
                      className: "flex items-center justify-between w-full",
                    })}
                  >
                    <p className="text-base">Pricing</p>
                    <Gem className="h-5 w-5 text-zinc-600" />
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    onClick={() => closeOnCurrentPage("/dashboard")}
                    href="/dashboard"
                    className={buttonVariants({
                      size: "sm",
                      variant: "ghost",
                      className: "flex items-center justify-between w-full",
                    })}
                  >
                    <p className="text-base">Dashboard</p>
                    <FilePieChart className="h-5 w-5 text-zinc-600" />
                  </Link>
                </li>
                {/* Visual separator */}
                <li className="my-3 h-px w-full bg-gray-300" />
                <li>
                  <Link
                    href="/sign-out"
                    className={buttonVariants({
                      size: "sm",
                      variant: "ghost",
                      className: "flex items-center justify-between w-full",
                    })}
                  >
                    <p className="text-base">Log out</p>
                    <LogOut className="h-5 w-5 text-zinc-600" />
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MobileNav;
