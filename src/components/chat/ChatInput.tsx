import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { Send } from "lucide-react";
import { useContext, useRef } from "react";
import { ChatContext } from "@/context/ChatContext";

const ChatInput = ({ isDisabled }: { isDisabled?: boolean }) => {
  const { addMessage, handleInputChange, message, isLoading } =
    useContext(ChatContext);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="absolute bottom-0 left-0 w-full">
      <form
        className="mx-2 flex-row gap-3 md:mx-4 lg:mx-auto lg:max-w-2xl xl:max-w-3xl"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="relative flex flex-1 items-stretch h-full md:flex-col">
          <div className="relative flex flex-col flex-grow w-full p-4">
            <div className="relative">
              <Textarea
                autoFocus={true}
                rows={1}
                maxRows={4}
                placeholder="Enter your question..."
                className="resize-none pr-12 text-base py-3 scrollbar-thumb~ scrollbar-thumb-rounded scrollbar-track-lighter scrollbar-w-2 scrolling-touch"
                ref={textAreaRef}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    addMessage();
                    textAreaRef.current?.focus();
                  }
                }}
                onChange={handleInputChange}
                value={message}
              />

              <Button
                aria-label="send message"
                className="absolute bottom-[5px] right-[8px]"
                disabled={isLoading || isDisabled}
                onClick={() => {
                  addMessage();
                  textAreaRef.current?.focus();
                }}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
