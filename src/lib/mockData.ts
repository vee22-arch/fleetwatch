import type { CrewMember, Message, CrewStatus, Coordinates } from "@/types";
import { getCurrentLocation } from "@/services/geolocator";

let messageIdCounter = 0;
const generateMessageId = () => `msg_${Date.now()}_${messageIdCounter++}`;

let lastLocation: Coordinates | undefined;
let lastLocationName: string | undefined;

// Initialize location
(async () => {
  try {
    const locationData = await getCurrentLocation();
    lastLocation = locationData.coordinates;
    // In a real app, you might reverse geocode this
    lastLocationName = `Lat: ${lastLocation.latitude.toFixed(2)}, Lon: ${lastLocation.longitude.toFixed(2)}`;
  } catch (error) {
    console.error("Failed to get initial location for mock data:", error);
    lastLocationName = "Unknown Location";
  }
})();


export const mockCrewMembers: CrewMember[] = [
  {
    id: "staff_john_doe",
    name: "John Doe",
    status: "Online",
    lastLocation: lastLocation,
    lastLocationName: "Near HQ",
    lastTimestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    avatarUrl: "https://picsum.photos/seed/john_doe/100/100",
  },
  {
    id: "staff_jane_smith",
    name: "Jane Smith",
    status: "Offline",
    lastLocation: { latitude: 34.0550, longitude: -118.2450 },
    lastLocationName: "Downtown Plaza",
    lastTimestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    avatarUrl: "https://picsum.photos/seed/jane_smith/100/100",
  },
  {
    id: "staff_alex_brown",
    name: "Alex Brown",
    status: "Break",
    lastLocation: { latitude: 34.0500, longitude: -118.2400 },
    lastLocationName: "City Park",
    lastTimestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    avatarUrl: "https://picsum.photos/seed/alex_brown/100/100",
  },
   {
    id: "staff_emily_white",
    name: "Emily White",
    status: "Online",
    lastLocation: { latitude: 34.0580, longitude: -118.2500 },
    lastLocationName: "West Suburbs",
    lastTimestamp: new Date(Date.now() - 1 * 60 * 1000).toISOString(), // 1 minute ago
    avatarUrl: "https://picsum.photos/seed/emily_white/100/100",
  },
];

export const mockMessages: Message[] = [
  {
    id: generateMessageId(),
    senderId: "staff_john_doe",
    senderName: "John Doe",
    receiverId: "admin_user",
    content: "Just arrived at the first location. All clear.",
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    isRead: true,
  },
  {
    id: generateMessageId(),
    senderId: "admin_user",
    senderName: "Admin",
    receiverId: "staff_john_doe",
    content: "Great, keep me updated on your progress.",
    timestamp: new Date(Date.now() - 9 * 60 * 1000).toISOString(),
    isRead: true,
  },
  {
    id: generateMessageId(),
    senderId: "admin_user",
    senderName: "Admin",
    receiverId: "broadcast",
    content: "Team meeting at 3 PM in the main conference room. Please acknowledge.",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: generateMessageId(),
    senderId: "staff_jane_smith",
    senderName: "Jane Smith",
    receiverId: "admin_user",
    content: "Acknowledged the 3 PM meeting. My current ETA back to base is 2:45 PM.",
    timestamp: new Date(Date.now() - 58 * 60 * 1000).toISOString(),
    isRead: false,
  },
];

// Function to add a new message (simulates sending)
export const addMockMessage = (message: Omit<Message, 'id' | 'timestamp' | 'isRead'>): Message => {
  const newMessage: Message = {
    ...message,
    id: generateMessageId(),
    timestamp: new Date().toISOString(),
    isRead: message.receiverId === 'admin_user' ? false : true, // Assume staff reads admin messages immediately for mock
  };
  mockMessages.push(newMessage);
  return newMessage;
};

// Function to update crew member status (simulates profile update)
export const updateMockCrewStatus = (crewId: string, status: CrewStatus): CrewMember | undefined => {
  const crewMember = mockCrewMembers.find(cm => cm.id === crewId);
  if (crewMember) {
    crewMember.status = status;
    crewMember.lastTimestamp = new Date().toISOString();
    // Optionally update location if status changes to Online
    if (status === 'Online') {
       (async () => {
          try {
            const locationData = await getCurrentLocation();
            crewMember.lastLocation = locationData.coordinates;
            crewMember.lastLocationName = `Refreshed: ${locationData.coordinates.latitude.toFixed(2)}, ${locationData.coordinates.longitude.toFixed(2)}`;
          } catch (error) {
            console.error("Error updating location on status change:", error);
          }
        })();
    }
  }
  return crewMember;
};
