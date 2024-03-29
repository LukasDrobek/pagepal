import { useToast } from "@/components/ui/use-toast";

import { ReactNode, createContext, useState } from "react";
import { useMutation } from "@tanstack/react-query";

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
  });

  const addMessage = () => sendMessage({ message });

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  return (
    <ChatContext.Provider
      value={{
        addMessage,
        message,
        handleInputChange,
        isLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
