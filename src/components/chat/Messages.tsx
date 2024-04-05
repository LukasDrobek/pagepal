"use client";

import { trpc } from "@/app/_trpc/client";
import { INFINITE_QUERY_LIMIT } from "@/config/infiniteQuery";
import Message from "@/components/chat/Message";
import { ChatContext } from "@/context/ChatContext";

import { Loader2, MessageSquare } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import { useContext, useRef, useEffect } from "react";
import { useIntersection } from "@mantine/hooks";

const Messages = ({ fileId }: { fileId: string }) => {
  // Fetch messages from the database
  const { data, isLoading, fetchNextPage } =
    trpc.getFileMessages.useInfiniteQuery(
      {
        limit: INFINITE_QUERY_LIMIT,
        fileId,
      },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        keepPreviousData: true,
      }
    );

  // Handle loading state
  const { isLoading: isAIThinking } = useContext(ChatContext);

  // Intersection message ref
  const lastMessageRef = useRef<HTMLDivElement>(null);

  // Intersection observer
  const { ref, entry } = useIntersection({
    root: lastMessageRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      // Load more messages
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  const messages = data?.pages.flatMap((page) => page.messages).flat() ?? [];
  const loadingMessage = {
    id: "loading-message",
    text: (
      <span className="flex items-center justify-center h-full">
        <Loader2 className="h-4 w-4 animate-spin" />
      </span>
    ),
    createdAt: new Date().toISOString(),
    isUserMessage: false,
  };

  const combinedMessages = [
    ...(isAIThinking ? [loadingMessage] : []),
    ...messages,
  ];

  const renderedMessages =
    combinedMessages && combinedMessages.length ? (
      combinedMessages.map((msg, index) => {
        // Check whethe there are 2 consecutive messages from the same user
        const isMessageSameUser =
          combinedMessages[index - 1]?.isUserMessage ===
          combinedMessages[index]?.isUserMessage;

        // Attach a ref to the last element rendered on the screen
        if (index === combinedMessages.length - 1) {
          return (
            <Message
              key={msg.id}
              ref={ref}
              message={msg}
              isMessageSameUser={isMessageSameUser}
            />
          );
        } else {
          return (
            <Message
              key={msg.id}
              message={msg}
              isMessageSameUser={isMessageSameUser}
            />
          );
        }
      })
    ) : isLoading ? (
      <div className="w-full flex flex-col gap-2">
        <Skeleton className="h-16" count={4} />
      </div>
    ) : (
      <div className="flex-1 flex flex-col items-center justify-center gap-2">
        {/* COLOR CHANGE */}
        <MessageSquare className="h-8 w-8 text-blue-500" />
        <h3 className="font-semibold text-xl">You&apos;re all set!</h3>
        <p className="text-sm text-zinc-500">
          Ask your first question to get started.
        </p>
      </div>
    );

  return (
    <div className="flex max-h-[calc(100vh-3.5rem-7rem)] border-zinc-200 flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb scrollbar-thumb-rounded scrollbar-track-lighter scrollbar-w-2">
      {renderedMessages}
    </div>
  );
};

export default Messages;
