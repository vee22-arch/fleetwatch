import type { Message } from "@/types";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { Check, CheckCheck } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

export default function MessageBubble({ message, isOwnMessage }: MessageBubbleProps) {
  return (
    <div className={cn("flex mb-3", isOwnMessage ? "justify-end" : "justify-start")}>
      <div 
        className={cn(
          "max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow",
          isOwnMessage ? "bg-primary text-primary-foreground rounded-br-none" : "bg-card text-card-foreground rounded-bl-none border"
        )}
      >
        {!isOwnMessage && (
          <p className="text-xs font-semibold text-muted-foreground mb-1">{message.senderName}</p>
        )}
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <div className={cn("text-xs mt-1 flex items-center", isOwnMessage ? "text-primary-foreground/70 justify-end" : "text-muted-foreground/70 justify-start")}>
          <span>{format(new Date(message.timestamp), "p")}</span>
          {isOwnMessage && message.isRead && <CheckCheck className="ml-1 h-4 w-4" />}
          {isOwnMessage && !message.isRead && <Check className="ml-1 h-4 w-4" />}
        </div>
      </div>
    </div>
  );
}
