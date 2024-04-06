import { cn } from "@/lib/utils";
import { ExtendedMessage } from "@/types/message";
import { Icons } from "@/components/Icons";

import Markdown from "react-markdown";
import { format } from "date-fns";
import { forwardRef } from "react";

interface MessageProps {
  message: ExtendedMessage;
  isMessageSameUser: boolean;
}

const Message = forwardRef<HTMLDivElement, MessageProps>(function Message(
  { message, isMessageSameUser },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn("flex items-end", {
        "justify-end": message.isUserMessage,
      })}
    >
      <div
        className={cn(
          "relative flex items-center justify-center h-6 w-6 aspect-square",
          {
            // COLOR CHANGE
            "order-2 bg-blue-600 rounded-sm": message.isUserMessage,
            "order-1 bg-zinc-800 rounded-sm": !message.isUserMessage,
            invisible: isMessageSameUser,
          }
        )}
      >
        {message.isUserMessage ? (
          <Icons.user className="h-3/4 w-3/4 text-zinc-200 fill-zinc-200" />
        ) : (
          <Icons.logo className="h-3/4 w-3/4 fill-zinc-300" />
        )}
      </div>
      <div
        className={cn("flex flex-col space-y-2 text-base max-w-md mx-2", {
          "order-1 items-end": message.isUserMessage,
          "order-2 items-start": !message.isUserMessage,
        })}
      >
        <div
          className={cn("px-4 py-3 rounded-lg inline-block", {
            // COLOR CHANGE
            "bg-blue-600 text-white": message.isUserMessage,
            "bg-gray-200 text-gray-900": !message.isUserMessage,
            // Conditional corner rounding
            "rounded-br-none": !isMessageSameUser && message.isUserMessage,
            "rounded-bl-none": !isMessageSameUser && !message.isUserMessage,
          })}
        >
          {typeof message.text === "string" ? (
            <Markdown
              className={cn("prose", {
                "text-zinc-50": message.isUserMessage,
              })}
            >
              {message.text}
            </Markdown>
          ) : (
            message.text
          )}
          {message.id !== "loading-message" ? (
            <div
              className={cn("text-xs select-none mt-2 w-full text-right", {
                // COLOR CHANGE
                "text-blue-200": message.isUserMessage,
                "text-zinc-500": !message.isUserMessage,
              })}
            >
              {format(new Date(message.createdAt), "HH:mm")}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
});

export default Message;
