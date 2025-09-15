import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BottomNavigation } from "@/components/bottom-navigation";
import { useAppState } from "@/hooks/use-app-state";
import { useToast } from "@/hooks/use-toast";
import { 
  Star, 
  Crown, 
  Settings, 
  Bell, 
  Store, 
  HelpCircle, 
  LogOut,
  Edit
} from "lucide-react";
import { getInterestEmoji } from "@/lib/mock-data";

export default function ProfileScreen() {
  const [, setLocation] = useLocation();
  const { currentUser, setCurrentUser } = useAppState();
  const { toast } = useToast();

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Please log in to view your profile</p>
          <Button onClick={() => setLocation("/login")} className="mt-4">
            Log In
          </Button>
        </div>
      </div>
    );
  }

  const handleSignOut = () => {
    setCurrentUser(null);
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out",
    });
    setLocation("/login");
  };

  const getSubscriptionBadge = () => {
    switch (currentUser.subscriptionType) {
      case "premium":
        return (
          <div className="inline-flex items-center bg-gradient-to-r from-neon-purple to-electric-pink px-4 py-2 rounded-full">
            <Crown className="text-white mr-2 w-4 h-4" />
            <span className="text-white font-poppins font-semibold">Premium User</span>
          </div>
        );
      case "elite":
        return (
          <div className="inline-flex items-center bg-gradient-to-r from-electric-pink to-yellow-400 px-4 py-2 rounded-full">
            <Crown className="text-white mr-2 w-4 h-4" />
            <span className="text-white font-poppins font-semibold">Elite User</span>
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center bg-gradient-to-r from-gray-600 to-gray-700 px-4 py-2 rounded-full">
            <Star className="text-white mr-2 w-4 h-4" />
            <span className="text-white font-poppins font-semibold">Free User</span>
          </div>
        );
    }
  };

  // Mock stats - in a real app these would come from the API
  const stats = {
    checkins: 23,
    venues: 12,
    connections: 7,
  };

  return (
    <div className="min-h-screen bg-midnight pb-20 animate-fade-in">
      {/* Header */}
      <div className="px-6 py-8 pt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-montserrat font-bold text-white" data-testid="profile-title">
            Profile
          </h2>
          <Button
            variant="link"
            className="text-neon-purple font-semibold text-sm p-0"
            data-testid="button-edit-profile"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-6 mb-8">
        <div className="text-center">
          <img
            src={currentUser.profileImageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-neon-purple"
            data-testid="profile-image"
          />
          <h3 className="text-2xl font-montserrat font-bold text-white mb-1" data-testid="profile-name">
            {currentUser.name || 'User'}, {currentUser.age || 28}
          </h3>
          <p className="text-gray-300 mb-4" data-testid="profile-location">
            İstanbul, Turkey
          </p>
          
          {/* Subscription Badge */}
          <div className="mb-6">
            {getSubscriptionBadge()}
          </div>
        </div>
      </div>

      {/* Interests */}
      {currentUser.interests && currentUser.interests.length > 0 && (
        <div className="px-6 mb-8">
          <h3 className="font-poppins font-semibold text-white mb-3" data-testid="interests-title">
            My Interests
          </h3>
          <div className="flex flex-wrap gap-2">
            {currentUser.interests.map((interest) => (
              <Badge
                key={interest}
                className="bg-neon-purple/20 text-white px-3 py-2 rounded-full text-sm border-none"
                data-testid={`interest-${interest}`}
              >
                {getInterestEmoji(interest)} {interest.charAt(0).toUpperCase() + interest.slice(1).replace('-', ' ')}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="px-6 mb-8">
        <h3 className="font-poppins font-semibold text-white mb-3" data-testid="stats-title">
          Your Stats
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="glass-effect rounded-xl p-4 text-center">
            <div className="text-2xl font-montserrat font-bold text-neon-purple mb-1" data-testid="stat-checkins">
              {stats.checkins}
            </div>
            <div className="text-xs text-gray-300">Check-ins</div>
          </div>
          <div className="glass-effect rounded-xl p-4 text-center">
            <div className="text-2xl font-montserrat font-bold text-electric-pink mb-1" data-testid="stat-venues">
              {stats.venues}
            </div>
            <div className="text-xs text-gray-300">Venues</div>
          </div>
          <div className="glass-effect rounded-xl p-4 text-center">
            <div className="text-2xl font-montserrat font-bold text-yellow-400 mb-1" data-testid="stat-connections">
              {stats.connections}
            </div>
            <div className="text-xs text-gray-300">Connections</div>
          </div>
        </div>
      </div>

      {/* Menu Options */}
      <div className="px-6 space-y-3 mb-8">
        {currentUser.subscriptionType === 'free' && (
          <Button
            variant="ghost"
            className="w-full glass-effect rounded-xl p-4 flex items-center justify-between hover:bg-white/10"
            onClick={() => setLocation("/subscription")}
            data-testid="button-upgrade"
          >
            <div className="flex items-center">
              <Crown className="text-neon-purple mr-4 text-xl" />
              <div className="text-left">
                <h4 className="font-opensans font-semibold text-white">Upgrade to Premium</h4>
                <p className="text-sm text-gray-400">See who's at venues before checking in</p>
              </div>
            </div>
            <div className="text-gray-400">›</div>
          </Button>
        )}

        <Button
          variant="ghost"
          className="w-full glass-effect rounded-xl p-4 flex items-center justify-between hover:bg-white/10"
          data-testid="button-settings"
        >
          <div className="flex items-center">
            <Settings className="text-gray-400 mr-4 text-xl" />
            <span className="font-opensans font-semibold text-white">Settings</span>
          </div>
          <div className="text-gray-400">›</div>
        </Button>

        <Button
          variant="ghost"
          className="w-full glass-effect rounded-xl p-4 flex items-center justify-between hover:bg-white/10"
          data-testid="button-notifications"
        >
          <div className="flex items-center">
            <Bell className="text-gray-400 mr-4 text-xl" />
            <span className="font-opensans font-semibold text-white">Notification Preferences</span>
          </div>
          <div className="text-gray-400">›</div>
        </Button>

        <Button
          variant="ghost"
          className="w-full glass-effect rounded-xl p-4 flex items-center justify-between hover:bg-white/10"
          onClick={() => setLocation("/venue-owner")}
          data-testid="button-venue-owner"
        >
          <div className="flex items-center">
            <Store className="text-gray-400 mr-4 text-xl" />
            <span className="font-opensans font-semibold text-white">Venue Owner Panel</span>
          </div>
          <div className="text-gray-400">›</div>
        </Button>

        <Button
          variant="ghost"
          className="w-full glass-effect rounded-xl p-4 flex items-center justify-between hover:bg-white/10"
          data-testid="button-help"
        >
          <div className="flex items-center">
            <HelpCircle className="text-gray-400 mr-4 text-xl" />
            <span className="font-opensans font-semibold text-white">Help & Support</span>
          </div>
          <div className="text-gray-400">›</div>
        </Button>

        <Button
          variant="ghost"
          className="w-full glass-effect rounded-xl p-4 flex items-center justify-between hover:bg-white/10 hover:bg-red-500/10"
          onClick={handleSignOut}
          data-testid="button-sign-out"
        >
          <div className="flex items-center">
            <LogOut className="text-red-400 mr-4 text-xl" />
            <span className="font-opensans font-semibold text-red-400">Sign Out</span>
          </div>
          <div className="text-gray-400">›</div>
        </Button>
      </div>

      <BottomNavigation onNavigate={setLocation} />
    </div>
  );
}
