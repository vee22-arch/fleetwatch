
export type UserRole = 'admin' | 'staff';

export interface User {
  id: string;
  username: string;
  role: UserRole;
}

export type CrewStatus = 'Online' | 'Offline' | 'Break';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface CrewMember {
  id: string;
  name: string;
  status: CrewStatus;
  lastLocation?: Coordinates; // Use the Coordinates type
  lastLocationName?: string; // e.g. "Downtown LA"
  lastTimestamp: string; // ISO string
  avatarUrl?: string; // Placeholder image URL
}

export interface Message {
  id: string;
  senderId: string; // 'admin' or crew member ID
  senderName: string; // Display name of sender
  receiverId: string; // 'admin', crew member ID, or 'broadcast'
  content: string;
  timestamp: string; // ISO string
  isRead?: boolean; // Optional for simplicity
}
