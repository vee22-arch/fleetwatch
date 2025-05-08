"use client";

import type { Message, User } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Users, X } from "lucide-react";
import MessageBubble from "./MessageBubble";
import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MessagingPanelProps {
  currentUser: User;
  messages: Message[];
  onSendMessage: (content: string, receiverId: string) => void;
  selectedConversationId: string | null; // 'broadcast' or crewMember.id or 'admin_user'
  conversationTargetName: string | null; // "Broadcast" or Crew Member Name or "Admin"
  onCloseConversation?: () => void; // For mobile or if panel can be closed
  isLoading?: boolean;
  isBroadcast?: boolean;
}

export default function MessagingPanel({
  currentUser,
  messages,
  onSendMessage,
  selectedConversationId,
  conversationTargetName,
  onCloseConversation,
  isLoading = false,
  isBroadcast = false,
}: MessagingPanelProps) {
  const [newMessage, setNewMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, selectedConversationId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && selectedConversationId) {
      onSendMessage(newMessage.trim(), selectedConversationId);
      setNewMessage("");
    }
  };

  if (!selectedConversationId || !conversationTargetName) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-card border-l text-muted-foreground p-4">
        <Users className="h-16 w-16 mb-4" />
        <p className="text-lg">Select a conversation</p>
        <p className="text-sm">Choose a crew member or broadcast to start messaging.</p>
      </div>
    );
  }
  
  const getInitials = (name: string) => {
    if (name === "Admin") return "AD";
    if (name === "Broadcast") return "BC";
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex flex-col h-full bg-card border-l">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
             {isBroadcast ? (
               <AvatarFallback className="bg-primary text-primary-foreground"><Users /></AvatarFallback>
             ) : (
              <>
                <AvatarImage src={`https://picsum.photos/seed/${selectedConversationId}/100/100`} alt={conversationTargetName} data-ai-hint="person user"/>
                <AvatarFallback className="bg-primary text-primary-foreground text-base">{getInitials(conversationTargetName)}</AvatarFallback>
              </>
             )}
          </Avatar>
          <h2 className="text-xl font-semibold">{conversationTargetName}</h2>
        </div>
        {onCloseConversation && (
          <Button variant="ghost" size="icon" onClick={onCloseConversation} className="md:hidden">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        {isLoading && <p className="text-center text-muted-foreground">Loading messages...</p>}
        {!isLoading && messages.length === 0 && (
          <p className="text-center text-muted-foreground pt-10">
            No messages yet. Start the conversation!
          </p>
        )}
        {!isLoading && messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isOwnMessage={msg.senderId === currentUser.id}
          />
        ))}
      </ScrollArea>

      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
            aria-label="Message input"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" aria-label="Send message" disabled={isLoading || !newMessage.trim()}>
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
