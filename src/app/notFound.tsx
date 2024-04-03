import MaxWidthWrapper from "@/components/MaxWidthWrapper";

import Link from "next/link";
import { ArrowRight, SearchX } from "lucide-react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { buttonVariants } from "@/components/ui/button";

const notFound = () => {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  return (
    <MaxWidthWrapper>
      <div className="flex flex-col items-center gap-2 mt-16 w-[60%] mx-auto px-2 py-6 border-2 rounded-md bg-white/50">
        <SearchX className="w-16 h-16 text-red-400" />
        <h1 className="text-4xl mt-5">404 Error</h1>
        <p className="text-xl font-thin text-zinc-700">
          Sorry, we couldn&apos;t find the page you were looking for.
        </p>

        <div className="mt-6 mb-4">
          {user ? (
            <Link
              href="/dashboard"
              className={buttonVariants({
                size: "lg",
                variant: "outline",
                className: "flex items-center gap-5",
              })}
            >
              <p className="text-sm">Go back home</p>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              href="/dashboard"
              className={buttonVariants({
                size: "lg",
                variant: "outline",
                className: "flex items-center gap-5",
              })}
            >
              <p className="text-sm">Get started</p>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default notFound;
