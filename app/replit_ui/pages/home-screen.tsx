import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { VenueCard } from "@/components/venue-card";
import { InteractiveMap } from "@/components/interactive-map";
import { BottomNavigation } from "@/components/bottom-navigation";
import { useAppState } from "@/hooks/use-app-state";
import { Search, Filter, Flame, Map as MapIcon, List } from "lucide-react";
import type { VenueWithStats } from "@shared/schema";

export default function HomeScreen() {
  const [, setLocation] = useLocation();
  const { setSelectedVenueId } = useAppState();
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');

  const { data: venues = [], isLoading } = useQuery<VenueWithStats[]>({
    queryKey: ['/api/venues'],
  });

  const handleVenueClick = (venue: VenueWithStats | string) => {
    const venueId = typeof venue === 'string' ? venue : venue.id;
    setSelectedVenueId(venueId);
    setLocation(`/venue/${venueId}`);
  };

  const showTrendingVenues = () => {
    setViewMode('list');
    // Scroll to trending venues section
    const trendingSection = document.getElementById('trending-section');
    trendingSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-midnight pb-20 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-midnight to-dark-gray px-6 py-4 pt-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-montserrat font-bold neon-glow" data-testid="app-title">
              MekanMatch
            </h1>
            <p className="text-sm text-gray-300" data-testid="location-text">
              İstanbul, Turkey
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              size="icon"
              variant="outline"
              className="w-10 h-10 bg-medium-gray border-gray-600 rounded-full text-gray-300"
              data-testid="button-search"
            >
              <Search className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="w-10 h-10 bg-medium-gray border-gray-600 rounded-full text-gray-300"
              data-testid="button-filter"
            >
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex bg-medium-gray rounded-xl p-1">
          <Button
            className={`flex-1 py-2 text-sm font-semibold ${
              viewMode === 'map'
                ? 'bg-neon-purple text-white'
                : 'bg-transparent text-gray-300'
            }`}
            onClick={() => setViewMode('map')}
            data-testid="toggle-map-view"
          >
            <MapIcon className="w-4 h-4 mr-2" />
            Map View
          </Button>
          <Button
            className={`flex-1 py-2 text-sm font-semibold ${
              viewMode === 'list'
                ? 'bg-neon-purple text-white'
                : 'bg-transparent text-gray-300'
            }`}
            onClick={() => setViewMode('list')}
            data-testid="toggle-list-view"
          >
            <List className="w-4 h-4 mr-2" />
            List View
          </Button>
        </div>
      </div>

      {/* Map View */}
      {viewMode === 'map' && (
        <div className="px-6 py-4">
          <InteractiveMap
            venues={venues}
            onVenueClick={handleVenueClick}
            userLocation={{ lat: 41.0082, lng: 28.9784 }}
          />
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div>
          {/* Trending Banner */}
          <div id="trending-section" className="mx-6 my-4 p-4 bg-gradient-to-r from-neon-purple/20 to-electric-pink/20 rounded-xl border border-neon-purple/30">
            <div className="flex items-center">
              <Flame className="text-electric-pink text-xl mr-3" />
              <div>
                <h3 className="font-poppins font-semibold text-white" data-testid="trending-title">
                  Where's busy tonight?
                </h3>
                <p className="text-sm text-gray-300" data-testid="trending-subtitle">
                  Kadıköy & Beyoğlu are buzzing!
                </p>
              </div>
            </div>
          </div>

          {/* Venue Cards */}
          <div className="px-6 space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-purple"></div>
              </div>
            ) : (
              venues.map((venue) => (
                <VenueCard
                  key={venue.id}
                  venue={venue}
                  onClick={() => handleVenueClick(venue)}
                />
              ))
            )}
          </div>
        </div>
      )}

      <BottomNavigation onNavigate={setLocation} />
    </div>
  );
}
