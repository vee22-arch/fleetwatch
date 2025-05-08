import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "@/components/shared/StatusBadge";
import type { CrewMember } from "@/types";
import { MapPin, Clock, User } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

interface CrewMemberCardProps {
  crewMember: CrewMember;
  onSelect: (crewMemberId: string) => void;
}

export default function CrewMemberCard({ crewMember, onSelect }: CrewMemberCardProps) {
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };
  
  return (
    <Card 
      className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      onClick={() => onSelect(crewMember.id)}
      aria-label={`Select ${crewMember.name} for details or messaging`}
    >
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={crewMember.avatarUrl} alt={crewMember.name} data-ai-hint="person portrait" />
          <AvatarFallback className="bg-primary text-primary-foreground text-lg">
            {getInitials(crewMember.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-lg font-semibold">{crewMember.name}</CardTitle>
          <StatusBadge status={crewMember.status} />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <span>{crewMember.lastLocationName || 'Location not available'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <span>Last seen: {formatDistanceToNow(new Date(crewMember.lastTimestamp), { addSuffix: true })}</span>
        </div>
      </CardContent>
    </Card>
  );
}
