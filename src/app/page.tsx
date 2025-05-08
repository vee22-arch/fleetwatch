"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, ShipWheel, UserCog, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UserTypeSelectionPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (user.role === 'staff') {
        router.push('/staff/dashboard');
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || user) {
    // Show a loading spinner or nothing while redirecting
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <ShipWheel className="h-8 w-8" />
          </div>
          <CardTitle className="text-3xl font-bold">Welcome to FleetWatch</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Please select your login type.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <Link href="/admin/login" passHref legacyBehavior>
            <Button variant="default" size="lg" className="w-full text-lg py-6">
              <UserCog className="mr-2 h-6 w-6" />
              Admin Login
            </Button>
          </Link>
          <Link href="/staff/login" passHref legacyBehavior>
            <Button variant="secondary" size="lg" className="w-full text-lg py-6">
              <User className="mr-2 h-6 w-6" />
              Staff Login
            </Button>
          </Link>
        </CardContent>
      </Card>
      <p className="mt-8 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} FleetWatch. All rights reserved.
      </p>
    </div>
  );
}
