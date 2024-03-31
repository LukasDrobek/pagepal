import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/app/_trpc/client";
import { INFINITE_QUERY_LIMIT } from "@/config/infiniteQuery";

import { ReactNode, createContext, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";

type ChatContextType = {
  addMessage: () => void;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  message: string;
  isLoading: boolean;
};

export const ChatContext = createContext<ChatContextType>({
  addMessage: () => {},
  handleInputChange: () => {},
  message: "",
  isLoading: false,
});

export const ChatContextProvider = ({
  fileId,
  children,
}: {
  fileId: string;
  children: ReactNode;
}) => {
  const { toast } = useToast();

  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Optimistic UI update
  const utils = trpc.useContext();
  // Create a backup of the current message
  const backupMessage = useRef<string>("");

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const res = await fetch("/api/message", {
        method: "POST",
        body: JSON.stringify({ fileId, message }),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      return res.body;
    },
    onMutate: async ({ message }) => {
      backupMessage.current = message;
      setMessage("");

      // Cancel refetching
      await utils.getFileMessages.cancel();

      // Snapshot prevous value
      const prevMessages = utils.getFileMessages.getInfiniteData();

      // Insert the new message
      utils.getFileMessages.setInfiniteData(
        { fileId, limit: INFINITE_QUERY_LIMIT },
        (old) => {
          if (!old) return { pages: [], pageParams: [] };

          let newPages = [...old.pages];
          let latestPage = newPages[0];

          // Force new message onto the page
          latestPage.messages = [
            {
              id: crypto.randomUUID(),
              text: message,
              createdAt: new Date().toISOString(),
              isUserMessage: true,
            },
            ...latestPage.messages,
          ];

          newPages[0] = latestPage;

          return { ...old, pages: newPages };
        }
      );

      setIsLoading(true);

      return {
        prevMessages: prevMessages?.pages.map((p) => p.messages).flat() ?? [],
      };
    },

    onSuccess: async (stream) => {
      setIsLoading(false);

      if (!stream) {
        return toast({
          title: "There was a problem sending your message",
          description: "Please refresh the page and try again.",
          variant: "destructive",
        });
      }

      // Real-time message streaming
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let isFinished = false;

      // Accumulated response
      let accResponse = "";

      while (!isFinished) {
        // Read the stream
        const { value, done } = await reader.read();
        isFinished = done;

        const chunk = decoder.decode(value);
        accResponse += chunk;

        // Append the chunk to the message
        utils.getFileMessages.setInfiniteData(
          { fileId, limit: INFINITE_QUERY_LIMIT },
          (old) => {
            if (!old) return { pages: [], pageParams: [] };

            // Check is message already exists
            let isResponseCreated = old.pages.some((page) =>
              page.messages.some((msg) => msg.id === "ai-response")
            );

            // Update the message
            let updatedPages = old.pages.map((page) => {
              if (page === old.pages[0]) {
                let updatedMessages;

                if (!isResponseCreated) {
                  // Create a new reference
                  updatedMessages = [
                    {
                      id: "ai-response",
                      text: accResponse,
                      createdAt: new Date().toISOString(),
                      isUserMessage: false,
                    },
                    ...page.messages,
                  ];
                } else {
                  // Add to the existing reference
                  updatedMessages = page.messages.map((msg) => {
                    if (msg.id === "ai-response") {
                      return {
                        ...msg,
                        text: accResponse,
                      };
                    }
                    return msg;
                  });
                }

                return {
                  ...page,
                  messages: updatedMessages,
                };
              }

              return page;
            });

            return { ...old, pages: updatedPages };
          }
        );
      }
    },

    onError: (_, __, context) => {
      // Restore the message
      setMessage(backupMessage.current);

      // Restore all previous messages
      utils.getFileMessages.setData(
        { fileId },
        { messages: context?.prevMessages ?? [] }
      );
    },

    onSettled: async () => {
      setIsLoading(false);

      // Invalidate the cache
      await utils.getFileMessages.invalidate({ fileId });
    },
  });

  const addMessage = () => sendMessage({ message });

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  return (
    <ChatContext.Provider
      value={{
        addMessage,
        handleInputChange,
        message,
        isLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
