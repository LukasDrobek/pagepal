import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import UserAccountNav from "@/components/UserAccountNav";
import MobileNav from "@/components/MobileNav";

import Link from "next/link";
import {
  LoginLink,
  RegisterLink,
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const Navbar = () => {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  let userName = "Your Account";

  if (user) {
    userName =
      !user.given_name || !user.family_name
        ? "Your Account"
        : `${
            user.given_name.charAt(0).toUpperCase() + user.given_name.slice(1)
          } ${
            user.family_name.charAt(0).toUpperCase() + user.family_name.slice(1)
          }`;
  }

  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link
            href="/"
            className="flex items-center z-40 font-semibold gap-2.5"
          >
            <svg
              width="35"
              height="35"
              viewBox="0 0 250 250"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M38 0C17.0132 0 0 17.0132 0 38V212C0 232.987 17.0132 250 38 250H212C232.987 250 250 232.987 250 212V38C250 17.0132 232.987 0 212 0H38ZM65.8218 158.916C67.66 153.815 69.7176 148.775 72.1511 143.315C93.6249 94.9625 129.387 64.9938 187.802 57.4075C182.444 67.4175 177.379 74.365 172.888 78.1275L162.443 86.8862L147.685 99.2675L162.892 111.999C151.09 130.243 127.768 144.759 101.521 147.506C87.7656 148.95 75.8484 152.818 65.8218 158.916ZM187.667 108L177.222 99.2588L187.698 90.4738C198.132 81.715 208.556 64.2237 219 38C65.5821 38 42.3692 155.472 31.6643 209.645C31.4377 210.793 31.2166 211.911 31 213H51.868C58.824 183.836 76.2349 167.797 104.111 164.875C145.889 160.5 177.222 134.25 187.667 108Z"
                fill="#393939"
              />
            </svg>
            PagePal.
          </Link>

          <MobileNav isAuth={!!user} />

          <div className="hidden items-center space-x-4 sm:flex">
            {!user ? (
              <>
                <Link
                  href="/pricing"
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Pricing
                </Link>
                <LoginLink
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Sign in
                </LoginLink>
                <RegisterLink
                  className={buttonVariants({
                    size: "sm",
                    className: "text-white",
                  })}
                >
                  Get started <ArrowRight className="ml-1.5 h-5 w-5" />
                </RegisterLink>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Dashboard
                </Link>
                <UserAccountNav
                  email={user.email ?? ""}
                  imageUrl={user.picture ?? ""}
                  name={userName}
                />
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
