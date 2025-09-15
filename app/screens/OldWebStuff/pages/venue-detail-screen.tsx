import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { CrowdBar } from "@/components/crowd-bar";
import { useAppState } from "@/hooks/use-app-state";
import { ArrowLeft, Share, Clock, DollarSign, Music, Heart } from "lucide-react";
import type { Venue, Event, MenuItem, VenueWithStats } from "@shared/schema";

export default function VenueDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { selectedVenueId, currentUser } = useAppState();

  const venueId = id || selectedVenueId || '';

  const { data: venues = [] } = useQuery<VenueWithStats[]>({
    queryKey: ['/api/venues'],
  });

  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ['/api/venues', venueId, 'events'],
    enabled: !!venueId,
  });

  const { data: menu = [] } = useQuery<MenuItem[]>({
    queryKey: ['/api/venues', venueId, 'menu'],
    enabled: !!venueId,
  });

  const venue = venues.find(v => v.id === venueId);

  if (!venue) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Venue not found</p>
          <Button onClick={() => setLocation("/home")} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const handleCheckin = () => {
    if (!currentUser) {
      setLocation("/login");
      return;
    }
    setLocation(`/checkin/${venueId}`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${venue.name} - MekanMatch`,
        text: `Check out ${venue.name} on MekanMatch!`,
        url: window.location.href,
      });
    }
  };

  const canCheckIn = currentUser?.subscriptionType !== 'free';

  return (
    <div className="min-h-screen bg-midnight animate-fade-in">
      {/* Header Image */}
      <div className="relative h-64">
        <img 
          src={venue.imageUrl || "https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"} 
          alt={venue.name}
          className="w-full h-64 object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        {/* Back Button */}
        <Button
          size="icon"
          variant="outline"
          className="absolute top-12 left-4 w-10 h-10 bg-black/50 border-none rounded-full backdrop-blur-sm"
          onClick={() => setLocation("/home")}
          data-testid="button-back"
        >
          <ArrowLeft className="text-white" />
        </Button>

        {/* Share Button */}
        <Button
          size="icon"
          variant="outline"
          className="absolute top-12 right-4 w-10 h-10 bg-black/50 border-none rounded-full backdrop-blur-sm"
          onClick={handleShare}
          data-testid="button-share"
        >
          <Share className="text-white" />
        </Button>

        {/* Venue Info Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-2xl font-montserrat font-bold text-white mb-1" data-testid="venue-name">
            {venue.name}
          </h1>
          <div className="flex items-center text-white/80">
            <span className="font-opensans" data-testid="venue-address">
              {venue.address}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {/* Status Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="glass-effect rounded-xl p-4 text-center">
            <div className="text-2xl font-montserrat font-bold text-electric-pink mb-1" data-testid="crowd-density">
              {venue.crowdDensity.toUpperCase()}
            </div>
            <div className="text-xs text-gray-300">Crowd Density</div>
          </div>
          <div className="glass-effect rounded-xl p-4 text-center">
            <div className="text-2xl font-montserrat font-bold text-neon-purple mb-1" data-testid="gender-ratio">
              {venue.genderRatio.male}/{venue.genderRatio.female}
            </div>
            <div className="text-xs text-gray-300">M/F Ratio</div>
          </div>
        </div>

        {/* Visual Crowd Bar */}
        <div className="glass-effect rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-poppins font-semibold text-white" data-testid="analytics-title">
              Live Crowd Analytics
            </h3>
            <span className="text-xs text-gray-300">Updated 2 min ago</span>
          </div>
          
          <CrowdBar 
            malePercentage={venue.genderRatio.male}
            femalePercentage={venue.genderRatio.female}
            totalPeople={venue.currentVisitors}
          />

          {/* Age Groups */}
          <div className="grid grid-cols-4 gap-2 text-center mt-4">
            <div>
              <div className="text-lg font-semibold text-neon-purple">15%</div>
              <div className="text-xs text-gray-400">20-25</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-electric-pink">45%</div>
              <div className="text-xs text-gray-400">25-30</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-yellow-400">30%</div>
              <div className="text-xs text-gray-400">30-35</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-green-400">10%</div>
              <div className="text-xs text-gray-400">35+</div>
            </div>
          </div>
        </div>

        {/* Quick Info */}
        <div className="space-y-4 mb-6">
          {/* Hours */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="text-neon-purple mr-3" />
              <span className="font-opensans">Hours</span>
            </div>
            <div className="text-right">
              <div className="text-green-400 font-semibold text-sm">Open Now</div>
              <div className="text-xs text-gray-400">Closes at 2:00 AM</div>
            </div>
          </div>

          {/* Price Range */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign className="text-neon-purple mr-3" />
              <span className="font-opensans">Price Range</span>
            </div>
            <span className="text-yellow-400">
              {'₺'.repeat(venue.priceRange || 1)}
            </span>
          </div>

          {/* Music */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Music className="text-neon-purple mr-3" />
              <span className="font-opensans">Music</span>
            </div>
            <span className="text-gray-300">
              {venue.musicGenres?.join(', ') || 'Various'}
            </span>
          </div>
        </div>

        {/* Events */}
        {events.length > 0 && (
          <div className="mb-6">
            <h3 className="font-poppins font-semibold text-white mb-3" data-testid="events-title">
              Tonight's Events
            </h3>
            {events.map((event) => (
              <div key={event.id} className="glass-effect rounded-xl p-4 mb-3">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-neon-purple to-electric-pink rounded-xl flex items-center justify-center mr-4">
                    <Music className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-poppins font-semibold text-white" data-testid={`event-title-${event.id}`}>
                      {event.title}
                    </h4>
                    <p className="text-sm text-gray-300">
                      Live Set • {event.startTime} - {event.endTime}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-neon-purple hover:bg-neon-purple/80"
                    data-testid={`button-like-event-${event.id}`}
                  >
                    <Heart className="w-4 h-4 mr-1" />
                    124
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Menu Preview */}
        {menu.length > 0 && (
          <div className="mb-20">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-poppins font-semibold text-white" data-testid="menu-title">
                Menu Highlights
              </h3>
              <Button variant="link" className="text-neon-purple text-sm font-semibold p-0">
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {menu.slice(0, 2).map((item) => (
                <div key={item.id} className="glass-effect rounded-lg p-3 flex justify-between items-center">
                  <div>
                    <h4 className="font-opensans font-semibold text-white" data-testid={`menu-item-${item.id}`}>
                      {item.name}
                    </h4>
                    <p className="text-xs text-gray-400">{item.description}</p>
                  </div>
                  <span className="text-neon-purple font-semibold">₺{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fixed Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-midnight via-midnight to-transparent">
        <div className="space-y-3">
          <Button 
            className="w-full bg-gradient-to-r from-electric-pink to-neon-purple text-white hover:opacity-90" 
            onClick={() => setLocation(`/matching/${venueId}`)}
            data-testid="button-start-matching"
          >
            🔥 Start Matching
            <div className="text-sm font-normal mt-1">Find people here now</div>
          </Button>
          <Button 
            className="w-full btn-primary animate-pulse-neon" 
            onClick={handleCheckin}
            data-testid="button-checkin"
          >
            {canCheckIn ? (
              <>
                Check In • See Who's Here
                <div className="text-sm font-normal mt-1">Premium Feature</div>
              </>
            ) : (
              <>
                Upgrade to Check In
                <div className="text-sm font-normal mt-1">Premium Required</div>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
