"use client";

import Messages from "@/components/chat/Messages";
import ChatInput from "@/components/chat/ChatInput";
import { trpc } from "@/app/_trpc/client";
import { buttonVariants } from "@/components/ui/button";
import { ChatContextProvider } from "@/context/ChatContext";

import { ChevronLeft, Loader2, XCircle } from "lucide-react";
import Link from "next/link";

const ChatWrapper = ({ fileId }: { fileId: string }) => {
  const { data, isLoading } = trpc.getFileUploadStatus.useQuery(
    {
      fileId,
    },
    {
      refetchInterval: (data) =>
        data?.status === "SUCCESS" || data?.status === "FAILED" ? false : 500,
    }
  );

  // Render loading state while processing the PDF
  if (isLoading || data?.status === "PENDING") {
    return (
      <div className="relative min-h-full bg-zinc-50 flex justify-between flex-col gap-2 divide-y divide-zinc-200">
        <div className="flex justify-center items-center flex-col flex-1 mb-28">
          <div className="flex items-center flex-col gap-2">
            {/* COLOR CHANGE */}
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            <h3 className="font-semibold text-xl">
              {isLoading ? "Loading..." : "Processing..."}
            </h3>
            <p className="text-zinc-500 text-sm">
              {isLoading
                ? "We&apos;re preparing your PDF."
                : "This won&apos;t take long."}
            </p>
          </div>
        </div>

        <ChatInput isDisabled />
      </div>
    );
  }

  if (data?.status === "FAILED") {
    return (
      <div className="relative min-h-full bg-zinc-50 flex justify-between flex-col gap-2 divide-y divide-zinc-200">
        <div className="flex justify-center items-center flex-col flex-1 mb-28">
          <div className="flex items-center flex-col gap-2">
            <XCircle className="h-8 w-8 text-red-500" />
            <h3 className="font-semibold text-xl">PDF size limit exceeded</h3>
            <p className="text-zinc-500 text-sm">
              Your <span className="font-medium">Free plan</span> suppports up
              to 5 pages.
            </p>
            <Link
              href="/dashboard"
              className={buttonVariants({
                className: "mt-4",
                variant: "secondary",
              })}
            >
              <ChevronLeft className="h-3 w-3" />
              Back
            </Link>
          </div>
        </div>

        <ChatInput isDisabled />
      </div>
    );
  }

  return (
    <ChatContextProvider fileId={fileId}>
      <div className="relative min-h-full bg-zinc-50 flex flex-col justify-between gap-2 divide-y divide-zinc-200">
        <div className="flex flex-col justify-between flex-1 mb-28">
          <Messages fileId={fileId} />
        </div>

        <ChatInput />
      </div>
    </ChatContextProvider>
  );
};

export default ChatWrapper;
