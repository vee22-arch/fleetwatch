"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "@/components/shared/StatusBadge";
import type { CrewMember, Coordinates } from "@/types";
import { MapPin, Wifi, SatelliteDish } from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentLocation } from "@/services/geolocator"; // Assuming this service exists

interface LiveLocationCardProps {
  crewMember: CrewMember;
}

export default function LiveLocationCard({ crewMember }: LiveLocationCardProps) {
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(crewMember.lastLocation || null);
  const [locationName, setLocationName] = useState<string>(crewMember.lastLocationName || "Fetching location...");
  const [isTracking, setIsTracking] = useState(crewMember.status === "Online");

  useEffect(() => {
    setIsTracking(crewMember.status === "Online");
    if (crewMember.status === "Online") {
      const fetchLocation = async () => {
        try {
          const data = await getCurrentLocation();
          setCurrentLocation(data.coordinates);
          // In a real app, you'd use reverse geocoding here
          setLocationName(`Lat: ${data.coordinates.latitude.toFixed(4)}, Lon: ${data.coordinates.longitude.toFixed(4)}`);
        } catch (error) {
          console.error("Error fetching location:", error);
          setLocationName("Could not fetch location");
        }
      };
      fetchLocation(); // Initial fetch
      const intervalId = setInterval(fetchLocation, 30000); // Update every 30 seconds
      return () => clearInterval(intervalId);
    } else {
      setLocationName(crewMember.lastLocationName || "Tracking paused");
    }
  }, [crewMember.status, crewMember.lastLocationName]);

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Live Location Sharing</CardTitle>
        <CardDescription>Your current location is being shared when Online.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
          <span className="font-medium">Tracking Status:</span>
          <StatusBadge status={isTracking ? "Online" : "Offline"} />
        </div>
        
        {isTracking && currentLocation ? (
          <div className="p-3 border rounded-md space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="font-medium">Current Location:</span>
            </div>
            <p className="text-muted-foreground pl-7">{locationName}</p>
          </div>
        ) : (
          <div className="p-3 border rounded-md text-center">
            <SatelliteDish className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">
              {crewMember.status === "Offline" ? "Location sharing is currently disabled as you are Offline." : "Location sharing is paused."}
            </p>
          </div>
        )}
        <div className="flex items-center gap-2 text-xs text-muted-foreground p-2 border-t">
          <Wifi className="h-4 w-4" />
          <span>Location updates automatically. Update interval: System Controlled.</span>
        </div>
      </CardContent>
    </Card>
  );
}
