import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { PLANS } from "@/config/stripe";
import { cn } from "@/lib/utils";
import UpgradeButton from "@/components/UpgradeButton";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ArrowRight, HelpCircle, Minus, Plus } from "lucide-react";
import Link from "next/link";

const Page = () => {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  const pricingItems = [
    {
      plan: "Free",
      tagline: "For small side projects.",
      quota: 10,
      features: [
        {
          text: "5 pages per PDF",
          footnote: "The maximum amount of pages per PDF-file.",
        },
        {
          text: "4MB file size limit",
          footnote: "The maximum file size of a single PDF file.",
        },
        {
          text: "Mobile-friendly interface",
        },
        {
          text: "Higher-quality responses",
          footnote: "Better algorithmic responses for enhanced content quality",
          negative: true,
        },
        {
          text: "Priority support",
          negative: true,
        },
      ],
    },
    {
      plan: "Premium",
      tagline: "For larger projects with higher needs.",
      quota: PLANS.find((p) => p.slug === "premium")!.quota,
      features: [
        {
          text: "25 pages per PDF",
          footnote: "The maximum amount of pages per PDF-file.",
        },
        {
          text: "16MB file size limit",
          footnote: "The maximum file size of a single PDF file.",
        },
        {
          text: "Mobile-friendly interface",
        },
        {
          text: "Higher-quality responses",
          footnote: "Better algorithmic responses for enhanced content quality",
        },
        {
          text: "Priority support",
        },
      ],
    },
  ];

  const renderedPlan = pricingItems.map(
    ({ plan, tagline, quota, features }) => {
      const price =
        PLANS.find((p) => p.slug === plan.toLowerCase())?.price.amount || 0;

      return (
        <div
          key={plan}
          className={cn("relative rounded-2xl bg-white shadow-lg", {
            // COLOR CHANGE
            "border-2 border-blue-500 shadow-blue-200": plan === "Premium",
            "border border-gray-200": plan === "Free",
          })}
        >
          {plan === "Premium" && (
            // COLOR CHANGE
            <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-sky-300 to-blue-500 px-3 py-2 text-sm font-medium text-white">
              Upgrade now
            </div>
          )}

          <div className="p-5">
            <h3 className="my-3 text-center font-display text-3xl font-bold">
              {plan}
            </h3>
            <p className="text-gray-500">{tagline}</p>
            <div className="flex items-end justify-center gap-2.5 mt-5">
              <div className="font-display text-6xl font-semibold">
                ${price}
              </div>{" "}
              <div className="text-gray-500 mb-1">/ month</div>
            </div>
          </div>

          <div className="flex h-20 items-center justify-center border-b border-t border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-1">
              <p>
                <span className="font-semibold">
                  {quota.toLocaleString()} PDFs
                </span>{" "}
                per month included
              </p>

              <Tooltip delayDuration={300}>
                <TooltipTrigger className="cursor-default ml-1.5">
                  <HelpCircle className="h-4 w-4 text-zinc-500" />
                </TooltipTrigger>
                <TooltipContent className="w-80 p-2">
                  How many PDFs you can upload per month.
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          <ul className="my-10 space-y-5 px-8">
            {features.map(({ text, footnote, negative }) => (
              <li key={text} className="flex space-x-5">
                <div className="flex-shrink-0">
                  {negative ? (
                    <Minus className="h-5 w-5 text-gray-300" />
                  ) : (
                    <Plus className="h-5 w-5 text-green-600" />
                  )}
                </div>
                {footnote ? (
                  <div className="flex items-center space-x-1">
                    <p
                      className={cn("text-gray-400", {
                        "text-gray-600": !negative,
                      })}
                    >
                      {text}
                    </p>
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger className="cursor-default ml-1.5">
                        <HelpCircle className="h-4 w-4 text-zinc-500" />
                      </TooltipTrigger>
                      <TooltipContent className="w-80 p-2">
                        {footnote}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                ) : (
                  <p
                    className={cn("text-gray-400", {
                      "text-gray-600": !negative,
                    })}
                  >
                    {text}
                  </p>
                )}
              </li>
            ))}
          </ul>
          {/* Visual seperator */}
          <div className="border-t border-gray-200" />
          <div className="p-5">
            {plan === "Free" ? (
              <Link
                href={user ? "/dashboard" : "/sign-in"}
                className={buttonVariants({
                  variant: "secondary",
                  className: "w-full",
                })}
              >
                {user ? "Dashboard" : "Sign in"}
                <ArrowRight className="h-5 w-5 ml-1.5" />
              </Link>
            ) : user ? (
              <UpgradeButton />
            ) : (
              <Link
                href="/sign-in"
                className={buttonVariants({ className: "w-full" })}
              >
                <p className="text-white">
                  {user ? "Upgrade now" : "Sign in to upgrade"}
                </p>
                <ArrowRight className="h-5 w-5 ml-1.5" />
              </Link>
            )}
          </div>
        </div>
      );
    }
  );

  return (
    <>
      <MaxWidthWrapper className="mb-8 mt-24 text-center max-w-5xl">
        <div className="mx-auto mb-10 sm:max-w-lg">
          <h1 className="text-6xl font-bold sm:text-7xl">Pricing</h1>
          <p className="mt-5 text-gray-600 sm:text-lg">
            Choose the plan that works the best for you
          </p>
        </div>

        <div className="pt-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <TooltipProvider>{renderedPlan}</TooltipProvider>
        </div>
      </MaxWidthWrapper>
    </>
  );
};

export default Page;
