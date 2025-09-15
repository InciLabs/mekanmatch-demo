import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppStateProvider } from "@/hooks/use-app-state";

import SplashScreen from "@/pages/splash-screen";
import LoginScreen from "@/pages/login-screen";
import VerificationScreen from "@/pages/verification-screen";
import ProfileSetupScreen from "@/pages/profile-setup-screen";
import HomeScreen from "@/pages/home-screen";
import VenueDetailScreen from "@/pages/venue-detail-screen";
import CheckinScreen from "@/pages/checkin-screen";
import PeopleScreen from "@/pages/people-screen";
import NotificationsScreen from "@/pages/notifications-screen";
import ProfileScreen from "@/pages/profile-screen";
import SubscriptionScreen from "@/pages/subscription-screen";
import VenueOwnerPanel from "@/pages/venue-owner-panel";
import MatchingScreen from "@/pages/matching-screen";
import ChatsScreen from "@/pages/chats-screen";
import ChatDetailScreen from "@/pages/chat-detail-screen";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={SplashScreen} />
      <Route path="/login" component={LoginScreen} />
      <Route path="/verify" component={VerificationScreen} />
      <Route path="/profile-setup" component={ProfileSetupScreen} />
      <Route path="/home" component={HomeScreen} />
      <Route path="/venue/:id" component={VenueDetailScreen} />
      <Route path="/checkin/:venueId" component={CheckinScreen} />
      <Route path="/people/:venueId" component={PeopleScreen} />
      <Route path="/matching/:venueId" component={MatchingScreen} />
      <Route path="/chats" component={ChatsScreen} />
      <Route path="/chat/:chatId" component={ChatDetailScreen} />
      <Route path="/notifications" component={NotificationsScreen} />
      <Route path="/profile" component={ProfileScreen} />
      <Route path="/subscription" component={SubscriptionScreen} />
      <Route path="/venue-owner" component={VenueOwnerPanel} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppStateProvider>
          <div className="min-h-screen bg-midnight text-white font-opensans overflow-x-hidden">
            <Toaster />
            <Router />
          </div>
        </AppStateProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
