"use client";

import { Button } from "./ui/button";
import { useAuth } from "@/contexts/auth-context";
import { AuthDialog } from "./auth/auth-dialog";
import { useState } from "react";

export function Header() {
  const { user, logout } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const openAuth = (mode: "login" | "register") => {
    setAuthMode(mode);
    setShowAuthDialog(true);
  };

  return (
    <header className="border-b sticky top-0 bg-background z-50">
      <div className="container mx-auto h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <img 
            src="/favicon-32x32.png"
            alt="Hidden Gem Logo"
            className="w-8 h-8 rounded-full"
          />
          <h1 className="text-xl font-semibold">Hidden Gem</h1>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground">
                Welcome, {user.username}
              </span>
              <Button
                variant="outline"
                onClick={logout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="ghost"
                onClick={() => openAuth("login")}
              >
                Login
              </Button>
              <Button 
                variant="default"
                onClick={() => openAuth("register")}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>

        {showAuthDialog && !user && (
          <AuthDialog 
            defaultMode={authMode}
            onClose={() => setShowAuthDialog(false)}
          />
        )}
      </div>
    </header>
  );
}