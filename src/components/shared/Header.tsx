"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Users2 } from "lucide-react"; // Changed ShipWheel to Users2
import Link from "next/link";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Users2 className="h-8 w-8" />
          <h1 className="text-2xl font-bold tracking-tight">Staff Track</h1>
        </Link>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm hidden md:inline">Welcome, {user.username} ({user.role})</span>
            <Button variant="ghost" size="icon" onClick={logout} aria-label="Logout">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
