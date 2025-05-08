"use client";

import LiveLocationCard from "@/components/staff/LiveLocationCard";
import ProfileStatusPanel from "@/components/staff/ProfileStatusPanel";
import MessagingPanel from "@/components/shared/MessagingPanel";
import { useAuth } from "@/contexts/AuthContext";
import { mockCrewMembers, mockMessages, addMockMessage, updateMockCrewStatus } from "@/lib/mockData";
import type { CrewMember, Message, User, CrewStatus } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, UserCircle, MapPin } from "lucide-react";


export default function StaffDashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [crewMember, setCrewMember] = useState<CrewMember | null>(null);
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  useEffect(() => {
    if (user) {
      const currentCrewMember = mockCrewMembers.find(cm => cm.id === user.id);
      setCrewMember(currentCrewMember || { // Fallback if not in mock, though ideally user.id would match
        id: user.id,
        name: user.username,
        status: 'Offline',
        lastTimestamp: new Date().toISOString(),
        avatarUrl: `https://picsum.photos/seed/${user.id}/100/100`
      });
    }
  }, [user]);

  const handleUpdateStatus = (newStatus: CrewStatus) => {
    if (!crewMember) return;
    const updatedCrewMember = updateMockCrewStatus(crewMember.id, newStatus);
    if (updatedCrewMember) {
      setCrewMember(updatedCrewMember);
      // In a real app, this would also trigger a backend update
    }
  };

  const handleSendMessage = (content: string) => {
    if (!user || !crewMember) return;
    const newMessage = addMockMessage({
      senderId: user.id,
      senderName: crewMember.name,
      receiverId: "admin_user", // Staff always messages admin
      content,
    });
    setMessages(prev => [...prev, newMessage]);
  };

  const adminConversationMessages = useMemo(() => {
    if (!user) return [];
    return messages.filter(
      (msg) =>
        (msg.senderId === user.id && msg.receiverId === "admin_user") ||
        (msg.senderId === "admin_user" && msg.receiverId === user.id)
    );
  }, [messages, user]);

  if (authLoading || !user || !crewMember) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-2 sm:px-4">
      <Tabs defaultValue="status" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 h-auto p-1">
          <TabsTrigger value="status" className="py-2.5 px-2 text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 h-full">
            <UserCircle className="h-5 w-5" /> Profile & Status
          </TabsTrigger>
          <TabsTrigger value="location" className="py-2.5 px-2 text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 h-full">
            <MapPin className="h-5 w-5" /> Live Location
          </TabsTrigger>
          <TabsTrigger value="messaging" className="py-2.5 px-2 text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 h-full">
            <MessageSquare className="h-5 w-5" /> Messages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="status">
          <div className="flex justify-center">
            <ProfileStatusPanel crewMember={crewMember} onUpdateStatus={handleUpdateStatus} />
          </div>
        </TabsContent>
        <TabsContent value="location">
          <div className="flex justify-center">
            <LiveLocationCard crewMember={crewMember} />
          </div>
        </TabsContent>
        <TabsContent value="messaging">
          <Card className="max-w-3xl mx-auto shadow-lg h-[calc(100vh-14rem)] sm:h-[calc(100vh-12rem)]">
            <CardContent className="p-0 h-full">
              <MessagingPanel
                currentUser={user}
                messages={adminConversationMessages}
                onSendMessage={(content) => handleSendMessage(content)}
                selectedConversationId="admin_user"
                conversationTargetName="Admin"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
