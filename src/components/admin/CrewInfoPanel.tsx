"use client";

import type { CrewMember } from "@/types";
import CrewMemberCard from "./CrewMemberCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useMemo } from "react";

interface CrewInfoPanelProps {
  crewMembers: CrewMember[];
  onSelectCrewMember: (crewMemberId: string) => void;
}

export default function CrewInfoPanel({ crewMembers, onSelectCrewMember }: CrewInfoPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCrewMembers = useMemo(() => {
    if (!searchTerm) return crewMembers;
    return crewMembers.filter(member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [crewMembers, searchTerm]);

  return (
    <div className="flex flex-col h-full bg-card border-l">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold mb-3">Crew Information</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search crew..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {filteredCrewMembers.length > 0 ? (
            filteredCrewMembers.map((member) => (
              <CrewMemberCard key={member.id} crewMember={member} onSelect={onSelectCrewMember} />
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">No crew members found.</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
