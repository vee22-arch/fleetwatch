"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import type { CrewMember, CrewStatus } from "@/types";
import { Power, Coffee, CheckCircle } from "lucide-react";
import { useState } from "react";

interface ProfileStatusPanelProps {
  crewMember: CrewMember;
  onUpdateStatus: (newStatus: CrewStatus) => void;
}

export default function ProfileStatusPanel({ crewMember, onUpdateStatus }: ProfileStatusPanelProps) {
  const [selectedStatus, setSelectedStatus] = useState<CrewStatus>(crewMember.status);
  const { toast } = useToast();

  const handleStatusChange = (newStatus: CrewStatus) => {
    setSelectedStatus(newStatus);
  };

  const handleSubmitStatus = () => {
    onUpdateStatus(selectedStatus);
    toast({
      title: "Status Updated",
      description: `Your status has been set to ${selectedStatus}.`,
      variant: "default",
      action: <CheckCircle className="text-status-online"/>
    });
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Your Status</CardTitle>
        <CardDescription>Update your current availability.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup
          value={selectedStatus}
          onValueChange={(value: string) => handleStatusChange(value as CrewStatus)}
          className="space-y-2"
        >
          <Label
            htmlFor="status-online"
            className={`flex items-center space-x-3 rounded-md border p-4 cursor-pointer transition-colors hover:bg-accent/50 ${selectedStatus === 'Online' ? 'border-primary ring-2 ring-primary bg-accent/30' : ''}`}
          >
            <RadioGroupItem value="Online" id="status-online" />
            <CheckCircle className="h-5 w-5 text-status-online" />
            <span className="font-medium">Online</span>
            <span className="text-sm text-muted-foreground ml-auto">Actively working and trackable</span>
          </Label>

           <Label
            htmlFor="status-break"
            className={`flex items-center space-x-3 rounded-md border p-4 cursor-pointer transition-colors hover:bg-accent/50 ${selectedStatus === 'Break' ? 'border-primary ring-2 ring-primary bg-accent/30' : ''}`}
          >
            <RadioGroupItem value="Break" id="status-break" />
            <Coffee className="h-5 w-5 text-status-break" />
            <span className="font-medium">On Break</span>
            <span className="text-sm text-muted-foreground ml-auto">Temporarily unavailable</span>
          </Label>

          <Label
            htmlFor="status-offline"
            className={`flex items-center space-x-3 rounded-md border p-4 cursor-pointer transition-colors hover:bg-accent/50 ${selectedStatus === 'Offline' ? 'border-primary ring-2 ring-primary bg-accent/30' : ''}`}
          >
            <RadioGroupItem value="Offline" id="status-offline" />
            <Power className="h-5 w-5 text-status-offline" />
            <span className="font-medium">Offline</span>
            <span className="text-sm text-muted-foreground ml-auto">Not working, tracking disabled</span>
          </Label>
        </RadioGroup>
        <Button 
          onClick={handleSubmitStatus} 
          className="w-full text-lg py-3"
          disabled={selectedStatus === crewMember.status}
        >
          Update Status
        </Button>
      </CardContent>
    </Card>
  );
}
