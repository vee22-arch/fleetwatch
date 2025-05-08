"use client";

import CrewInfoPanel from "@/components/admin/CrewInfoPanel";
import FleetMap from "@/components/admin/FleetMap";
import MessagingPanel from "@/components/shared/MessagingPanel";
import { useAuth } from "@/contexts/AuthContext";
import { mockCrewMembers, mockMessages, addMockMessage } from "@/lib/mockData";
import type { CrewMember, Message, User } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users, X, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminDashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>(mockCrewMembers);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [selectedCrewMemberId, setSelectedCrewMemberId] = useState<string | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null); // for messaging
  const [isMobileView, setIsMobileView] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<'map' | 'crew' | 'chat'>('map');

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const handleSelectCrewMember = (crewId: string) => {
    setSelectedCrewMemberId(crewId); // For map highlighting
    setActiveConversationId(crewId); // For messaging
    if (isMobileView) setActiveMobileTab('chat');
  };

  const handleSendMessage = (content: string, receiverId: string) => {
    if (!user) return;
    const newMessage = addMockMessage({
      senderId: user.id,
      senderName: user.username,
      receiverId,
      content,
    });
    setMessages(prev => [...prev, newMessage]);
  };

  const handleBroadcast = () => {
    setActiveConversationId("broadcast");
    if (isMobileView) setActiveMobileTab('chat');
  };

  const currentConversationMessages = useMemo(() => {
    if (!activeConversationId) return [];
    if (activeConversationId === "broadcast") {
      return messages.filter(msg => msg.receiverId === "broadcast" || (msg.senderId === user?.id && msg.receiverId === "broadcast"));
    }
    return messages.filter(
      (msg) =>
        (msg.senderId === user?.id && msg.receiverId === activeConversationId) ||
        (msg.senderId === activeConversationId && msg.receiverId === user?.id)
    );
  }, [messages, activeConversationId, user]);

  const conversationTarget = useMemo(() => {
    if (!activeConversationId) return null;
    if (activeConversationId === "broadcast") return { id: "broadcast", name: "Broadcast" };
    return crewMembers.find(cm => cm.id === activeConversationId) || null;
  }, [activeConversationId, crewMembers]);


  if (authLoading || !user) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const commonMessagingPanelProps = {
    currentUser: user,
    messages: currentConversationMessages,
    onSendMessage: handleSendMessage,
    selectedConversationId: activeConversationId,
    conversationTargetName: conversationTarget?.name || null,
    isBroadcast: activeConversationId === "broadcast",
  };

  if (isMobileView) {
    return (
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        <Tabs value={activeMobileTab} onValueChange={(value) => setActiveMobileTab(value as any)} className="flex-1 flex flex-col">
          <TabsContent value="map" className="flex-1 mt-0 overflow-hidden">
            <Card className="h-full rounded-none border-0"><CardContent className="p-2 h-full"><FleetMap crewMembers={crewMembers} selectedCrewMemberId={selectedCrewMemberId} onPinClick={handleSelectCrewMember} /></CardContent></Card>
          </TabsContent>
          <TabsContent value="crew" className="flex-1 mt-0 overflow-hidden">
             <Card className="h-full rounded-none border-0"><CardContent className="p-0 h-full"><CrewInfoPanel crewMembers={crewMembers} onSelectCrewMember={handleSelectCrewMember} /></CardContent></Card>
          </TabsContent>
          <TabsContent value="chat" className="flex-1 mt-0 overflow-hidden">
            <Card className="h-full rounded-none border-0"><CardContent className="p-0 h-full">
            {activeConversationId ? (
              <MessagingPanel {...commonMessagingPanelProps} onCloseConversation={() => setActiveMobileTab('crew')}/>
            ) : (
              <div className="flex flex-col h-full items-center justify-center p-4 text-center">
                 <Users className="h-16 w-16 mb-4 text-muted-foreground" />
                <p className="text-lg font-medium">No Conversation Selected</p>
                <p className="text-sm text-muted-foreground mb-4">Select a crew member from the 'Crew' tab to start chatting or click 'Broadcast'.</p>
                <Button onClick={handleBroadcast} className="mb-2 w-full max-w-xs">
                  <MessageSquare className="mr-2 h-4 w-4" /> Broadcast Message
                </Button>
              </div>
            )}
            </CardContent></Card>
          </TabsContent>
          <TabsList className="grid w-full grid-cols-3 rounded-none h-16">
            <TabsTrigger value="map" className="text-xs h-full rounded-none py-1 px-0 flex flex-col items-center justify-center gap-1"><MapPin className="h-5 w-5"/>Map</TabsTrigger>
            <TabsTrigger value="crew" className="text-xs h-full rounded-none py-1 px-0 flex flex-col items-center justify-center gap-1"><Users className="h-5 w-5"/>Crew</TabsTrigger>
            <TabsTrigger value="chat" className="text-xs h-full rounded-none py-1 px-0 flex flex-col items-center justify-center gap-1"><MessageSquare className="h-5 w-5"/>Chat</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 h-[calc(100vh-4rem)]">
      {/* Left Panel: Map */}
      <div className="md:col-span-2 p-4">
        <FleetMap crewMembers={crewMembers} selectedCrewMemberId={selectedCrewMemberId} onPinClick={handleSelectCrewMember} />
      </div>

      {/* Right Panel: Tabs for Crew Info and Messaging */}
      <div className="flex flex-col border-l">
        <Tabs defaultValue="crew" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2 rounded-none">
            <TabsTrigger value="crew" className="rounded-none">Crew List</TabsTrigger>
            <TabsTrigger value="messaging" className="rounded-none" disabled={!activeConversationId && activeConversationId !== "broadcast"}>
              Chat
              {activeConversationId === "broadcast" && " (Broadcast)"}
              {conversationTarget && activeConversationId !== "broadcast" && ` (${conversationTarget.name})`}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="crew" className="flex-1 mt-0 overflow-hidden">
            <CrewInfoPanel crewMembers={crewMembers} onSelectCrewMember={handleSelectCrewMember} />
            <div className="p-4 border-t">
              <Button onClick={handleBroadcast} className="w-full">
                <MessageSquare className="mr-2 h-4 w-4" /> Broadcast Message
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="messaging" className="flex-1 mt-0 overflow-hidden">
            <MessagingPanel {...commonMessagingPanelProps} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
