import { Home, Bell, User, MessageCircle } from "lucide-react";
import { useLocation } from "wouter";

interface BottomNavigationProps {
  onNavigate: (path: string) => void;
}

export function BottomNavigation({ onNavigate }: BottomNavigationProps) {
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === "/home" && (location === "/home" || location === "/")) {
      return true;
    }
    return location === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-midnight border-t border-gray-700">
      <div className="flex">
        <button 
          className={`flex-1 py-4 flex flex-col items-center ${
            isActive("/home") ? "text-neon-purple" : "text-gray-400"
          }`}
          onClick={() => onNavigate("/home")}
          data-testid="nav-home"
        >
          <Home className="w-6 h-6 mb-1" />
          <span className="text-xs font-opensans">Home</span>
        </button>
        <button 
          className={`flex-1 py-4 flex flex-col items-center ${
            isActive("/chats") ? "text-neon-purple" : "text-gray-400"
          }`}
          onClick={() => onNavigate("/chats")}
          data-testid="nav-chats"
        >
          <MessageCircle className="w-6 h-6 mb-1" />
          <span className="text-xs font-opensans">Chats</span>
        </button>
        <button 
          className={`flex-1 py-4 flex flex-col items-center ${
            isActive("/notifications") ? "text-neon-purple" : "text-gray-400"
          }`}
          onClick={() => onNavigate("/notifications")}
          data-testid="nav-notifications"
        >
          <Bell className="w-6 h-6 mb-1" />
          <span className="text-xs font-opensans">Alerts</span>
        </button>
        <button 
          className={`flex-1 py-4 flex flex-col items-center ${
            isActive("/profile") ? "text-neon-purple" : "text-gray-400"
          }`}
          onClick={() => onNavigate("/profile")}
          data-testid="nav-profile"
        >
          <User className="w-6 h-6 mb-1" />
          <span className="text-xs font-opensans">Profile</span>
        </button>
      </div>
    </div>
  );
}
