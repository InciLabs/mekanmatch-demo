import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAppState } from "@/hooks/use-app-state";

export default function SplashScreen() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAppState();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        setLocation("/home");
      } else {
        setLocation("/login");
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [setLocation, isAuthenticated]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-midnight via-dark-gray to-midnight relative overflow-hidden animate-fade-in">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-neon-purple rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-electric-pink rounded-full opacity-20 blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="text-center z-10">
        {/* Logo */}
        <h1 className="text-5xl font-montserrat font-bold mb-4 neon-glow animate-glow" data-testid="logo-title">
          MekanMatch
        </h1>
        <p className="text-lg font-opensans text-gray-300 mb-8" data-testid="tagline">
          See the crowd. Join the vibe.
        </p>
        
        {/* Loading indicator */}
        <div className="flex justify-center mb-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-purple" data-testid="loading-spinner"></div>
        </div>
      </div>
      
      <div className="absolute bottom-8 text-center">
        <p className="text-xs text-gray-400" data-testid="loading-text">
          Loading your nightlife experience...
        </p>
      </div>
    </div>
  );
}
