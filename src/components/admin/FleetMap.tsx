"use client";

import type { CrewMember } from "@/types";
import { MapPin } from "lucide-react";
import Image from 'next/image';

interface FleetMapProps {
  crewMembers: CrewMember[];
  selectedCrewMemberId?: string | null;
  onPinClick: (crewMemberId: string) => void;
}

// This is a placeholder. In a real app, you'd use a library like @vis.gl/react-google-maps or Leaflet.
export default function FleetMap({ crewMembers, selectedCrewMemberId, onPinClick }: FleetMapProps) {
  // Calculate a pseudo-random but stable position for pins based on ID
  // This is just for visual representation in the placeholder
  const getPinPosition = (id: string, index: number) => {
    const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const x = (hash % 80) + 10; // % of width (10-90%)
    const y = ((hash * (index +1)) % 70) + 15; // % of height (15-85%)
    return { top: `${y}%`, left: `${x}%` };
  };


  return (
    <div className="relative w-full h-full bg-muted/30 rounded-lg overflow-hidden shadow-inner">
      <Image 
        src="https://picsum.photos/seed/mapbg/1200/800" 
        alt="Abstract map background"
        layout="fill"
        objectFit="cover"
        className="opacity-50"
        data-ai-hint="map satellite"
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center p-4 bg-background/80 rounded-lg shadow-xl backdrop-blur-sm">
          <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
          <h3 className="text-xl font-semibold text-foreground">Fleet GPS Tracking Map</h3>
          <p className="text-sm text-muted-foreground">Real-time locations will be shown here.</p>
        </div>
      </div>

      {crewMembers.map((member, index) => {
        if (!member.lastLocation) return null;
        const position = getPinPosition(member.id, index);
        const isSelected = member.id === selectedCrewMemberId;
        
        let pinColorClass = "text-primary";
        if (member.status === "Offline") pinColorClass = "text-status-offline";
        else if (member.status === "Break") pinColorClass = "text-status-break";


        return (
          <button
            key={member.id}
            style={position}
            className={`absolute transform -translate-x-1/2 -translate-y-full p-1 rounded-full focus:outline-none transition-all duration-200 hover:scale-125 ${ isSelected ? 'scale-125 z-10' : 'scale-100'}`}
            onClick={() => onPinClick(member.id)}
            title={member.name}
            aria-label={`Location of ${member.name}`}
          >
            <MapPin 
              className={`h-8 w-8 drop-shadow-lg ${pinColorClass} ${isSelected ? 'fill-current' : 'fill-transparent stroke-current'}`} 
              strokeWidth={isSelected ? 1.5 : 2}
            />
            {isSelected && (
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-card text-card-foreground text-xs px-2 py-1 rounded shadow-md">
                {member.name}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
