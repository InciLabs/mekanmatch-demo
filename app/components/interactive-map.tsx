import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Navigation, ZoomIn, ZoomOut, Coffee, Music, Utensils, Wine } from "lucide-react";
import type { VenueWithStats } from "@shared/schema";

interface InteractiveMapProps {
  venues: VenueWithStats[];
  onVenueClick: (venueId: string) => void;
  userLocation?: { lat: number; lng: number };
}

interface MapVenue extends VenueWithStats {
  lat: number;
  lng: number;
}

interface UserOnMap {
  id: string;
  name: string;
  avatar: string;
  lat: number;
  lng: number;
  venueId?: string;
  isOnline: boolean;
}

export function InteractiveMap({ venues, onVenueClick, userLocation }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(14);
  const [center, setCenter] = useState({ lat: 41.0082, lng: 28.9784 }); // Istanbul center
  const [selectedVenue, setSelectedVenue] = useState<MapVenue | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserOnMap | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Fixed coordinates for venues to prevent shuffling
  const venuesWithCoords: MapVenue[] = venues.map((venue, index) => {
    // Use venue ID to create consistent positions
    const hash = venue.id.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const latOffset = ((Math.abs(hash) % 1000) / 1000 - 0.5) * 0.02;
    const lngOffset = ((Math.abs(hash * 2) % 1000) / 1000 - 0.5) * 0.02;
    
    return {
      ...venue,
      lat: 41.0082 + latOffset,
      lng: 28.9784 + lngOffset,
    };
  });

  // Mock users on the map (Snapchat style)
  const usersOnMap: UserOnMap[] = [
    {
      id: 'user1',
      name: 'Alex M.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      lat: 41.0090,
      lng: 28.9790,
      venueId: 'venue-1',
      isOnline: true,
    },
    {
      id: 'user2',
      name: 'Sarah K.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=100&h=100&fit=crop&crop=face',
      lat: 41.0075,
      lng: 28.9775,
      venueId: 'venue-2',
      isOnline: true,
    },
    {
      id: 'user3',
      name: 'Mike R.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      lat: 41.0088,
      lng: 28.9800,
      isOnline: false,
    },
    {
      id: 'user4',
      name: 'Emma L.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      lat: 41.0070,
      lng: 28.9785,
      venueId: 'venue-1',
      isOnline: true,
    },
  ];

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 1, 10));
  };

  const handleCenterOnUser = () => {
    if (userLocation) {
      setCenter(userLocation);
    }
  };

  const calculateDistance = (venue: MapVenue) => {
    if (!userLocation) return 0;
    const R = 6371; // Earth's radius in km
    const dLat = (venue.lat - userLocation.lat) * Math.PI / 180;
    const dLng = (venue.lng - userLocation.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(venue.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getMarkerPosition = (venue: MapVenue) => {
    // Use fixed map dimensions for consistent positioning
    const mapWidth = 500;
    const mapHeight = 500;
    
    // Normalize coordinates to map area
    const latRange = 0.02;
    const lngRange = 0.02;
    
    const x = ((venue.lng - (center.lng - lngRange/2)) / lngRange) * mapWidth;
    const y = ((center.lat + latRange/2 - venue.lat) / latRange) * mapHeight;
    
    // Ensure markers stay within visible bounds
    return { 
      x: Math.max(30, Math.min(x, mapWidth - 30)),
      y: Math.max(30, Math.min(y, mapHeight - 30))
    };
  };

  const getVenueTypeIcon = (venueType: string) => {
    switch (venueType) {
      case 'nightclub': return Music;
      case 'bar': return Wine;
      case 'restaurant': return Utensils;
      case 'cafe': return Coffee;
      default: return MapPin;
    }
  };

  const getVenueTypeColor = (venueType: string) => {
    switch (venueType) {
      case 'nightclub': return '#FF3040'; // Snapchat red-pink
      case 'bar': return '#FF9500'; // Orange
      case 'restaurant': return '#30D158'; // Green
      case 'cafe': return '#FFD60A'; // Yellow
      default: return '#8E8E93'; // Gray
    }
  };

  return (
    <div className="relative w-full h-[500px] bg-black rounded-xl overflow-hidden" data-testid="interactive-map">
      {/* Snapchat-style Map Background */}
      <div 
        ref={mapRef}
        className="absolute inset-0 bg-black"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, #1a1a1a 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, #2a2a2a 0%, transparent 50%),
            linear-gradient(90deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)
          `,
        }}
      >
        {/* Street Network Pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%">
            <defs>
              {/* Major streets pattern */}
              <pattern id="major-streets" width="120" height="120" patternUnits="userSpaceOnUse">
                <path d="M 0 40 L 120 40 M 0 80 L 120 80 M 40 0 L 40 120 M 80 0 L 80 120" 
                      fill="none" stroke="#555" strokeWidth="2"/>
              </pattern>
              {/* Minor streets pattern */}
              <pattern id="minor-streets" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 0 20 L 40 20 M 20 0 L 20 40" 
                      fill="none" stroke="#333" strokeWidth="0.8"/>
              </pattern>
              {/* City blocks */}
              <pattern id="city-blocks" width="80" height="80" patternUnits="userSpaceOnUse">
                <rect x="2" y="2" width="76" height="76" fill="none" stroke="#444" strokeWidth="0.5" rx="4"/>
                <rect x="10" y="10" width="20" height="15" fill="#1a1a1a" opacity="0.6" rx="2"/>
                <rect x="35" y="8" width="25" height="18" fill="#1a1a1a" opacity="0.4" rx="2"/>
                <rect x="12" y="35" width="18" height="12" fill="#1a1a1a" opacity="0.5" rx="2"/>
                <rect x="45" y="38" width="22" height="16" fill="#1a1a1a" opacity="0.3" rx="2"/>
              </pattern>
            </defs>
            
            {/* Layer the patterns */}
            <rect width="100%" height="100%" fill="url(#city-blocks)" />
            <rect width="100%" height="100%" fill="url(#minor-streets)" />
            <rect width="100%" height="100%" fill="url(#major-streets)" />
          </svg>
        </div>

        {/* Major landmarks and areas */}
        <div className="absolute inset-0 opacity-15">
          {/* Bosphorus representation */}
          <div className="absolute top-0 left-1/3 w-1 h-full bg-gradient-to-b from-blue-800 to-blue-900 transform rotate-12"></div>
          <div className="absolute top-1/4 left-1/2 w-full h-0.5 bg-blue-800 opacity-60"></div>
          
          {/* Park areas */}
          <div className="absolute top-1/4 left-1/4 w-20 h-16 bg-green-900 opacity-40 rounded-xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-16 h-20 bg-green-900 opacity-30 rounded-xl"></div>
          
          {/* Commercial districts */}
          <div className="absolute top-1/3 right-1/3 w-12 h-12 bg-yellow-900 opacity-20 rounded-lg"></div>
          <div className="absolute bottom-1/2 left-1/3 w-14 h-10 bg-purple-900 opacity-25 rounded-lg"></div>
        </div>

        {/* User Location (Your Bitmoji) */}
        {userLocation && (
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 z-30"
            style={{
              left: '50%',
              top: '50%'
            }}
          >
            <div className="relative">
              <div className="w-12 h-12 bg-blue-500 rounded-full border-3 border-white shadow-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face"
                  alt="You"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
          </div>
        )}

        {/* Friends/Users on Map (Snapchat style) */}
        {usersOnMap.map((user) => {
          const position = getMarkerPosition({ ...center, lat: user.lat, lng: user.lng } as MapVenue);
          
          return (
            <div
              key={user.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer transition-all hover:scale-110"
              style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
              }}
              onClick={() => setSelectedUser(user)}
              data-testid={`user-marker-${user.id}`}
            >
              <div className="relative animate-bounce-subtle">
                <div className={`w-10 h-10 rounded-full border-2 ${user.isOnline ? 'border-white' : 'border-gray-400'} shadow-lg overflow-hidden`}>
                  <img 
                    src={user.avatar}
                    alt={user.name}
                    className={`w-full h-full object-cover ${!user.isOnline ? 'grayscale' : ''}`}
                  />
                </div>
                {user.isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border border-white"></div>
                )}
                {user.venueId && (
                  <div className="absolute -top-1 -left-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <Music className="text-white w-2 h-2" />
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Venue Hot Spots */}
        {venuesWithCoords.map((venue) => {
          const position = getMarkerPosition(venue);
          const VenueIcon = getVenueTypeIcon(venue.venueType);
          
          return (
            <div
              key={venue.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-15 cursor-pointer transition-all hover:scale-110"
              style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
              }}
              onClick={() => setSelectedVenue(venue)}
              data-testid={`map-marker-${venue.id}`}
            >
              {/* Heat indicator for popular venues */}
              {venue.currentVisitors >= 5 && (
                <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20 scale-150"></div>
              )}
              
              {/* Venue marker */}
              <div 
                className="w-7 h-7 rounded-full flex items-center justify-center border-2 border-white shadow-xl"
                style={{ backgroundColor: getVenueTypeColor(venue.venueType) }}
              >
                <VenueIcon className="text-white w-3 h-3" />
              </div>
              
              {/* Visitor count */}
              {venue.currentVisitors > 0 && (
                <div 
                  className="absolute -top-2 -right-2 min-w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold px-1"
                  style={{ backgroundColor: getVenueTypeColor(venue.venueType) }}
                >
                  {venue.currentVisitors}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Snapchat-style Controls */}
      <div className="absolute top-4 right-4 z-50 space-y-2">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 bg-black bg-opacity-60 hover:bg-opacity-80 rounded-full flex items-center justify-center backdrop-blur-sm border border-gray-600"
          data-testid="map-zoom-in"
        >
          <ZoomIn className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 bg-black bg-opacity-60 hover:bg-opacity-80 rounded-full flex items-center justify-center backdrop-blur-sm border border-gray-600"
          data-testid="map-zoom-out"
        >
          <ZoomOut className="w-5 h-5 text-white" />
        </button>
        {userLocation && (
          <button
            onClick={handleCenterOnUser}
            className="w-10 h-10 bg-black bg-opacity-60 hover:bg-opacity-80 rounded-full flex items-center justify-center backdrop-blur-sm border border-gray-600"
            data-testid="map-center-user"
          >
            <Navigation className="w-5 h-5 text-white" />
          </button>
        )}
      </div>

      {/* User Popup (Snapchat style) */}
      {selectedUser && (
        <div className="absolute bottom-4 left-4 right-4 z-40 animate-fade-in">
          <div className="bg-black bg-opacity-90 backdrop-blur-lg rounded-2xl p-4 max-w-sm mx-auto border border-gray-700">
            <div className="flex items-center space-x-3 mb-3">
              <div className="relative">
                <img 
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {selectedUser.isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 rounded-full border-2 border-black"></div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold" data-testid={`user-popup-name-${selectedUser.id}`}>
                  {selectedUser.name}
                </h3>
                <p className="text-gray-400 text-sm">
                  {selectedUser.isOnline ? 'Active now' : 'Last seen recently'}
                </p>
              </div>
              <button 
                onClick={() => setSelectedUser(null)}
                className="text-gray-400 hover:text-white text-xl"
                data-testid="user-popup-close"
              >
                ×
              </button>
            </div>
            
            {selectedUser.venueId && (
              <div className="bg-gray-800 rounded-lg p-2 mb-3">
                <p className="text-gray-300 text-xs">Currently at</p>
                <p className="text-white font-medium">
                  {venuesWithCoords.find(v => v.id === selectedUser.venueId)?.name || 'Unknown venue'}
                </p>
              </div>
            )}
            
            <div className="flex space-x-2">
              <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-xl font-medium">
                Message
              </button>
              <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl">
                👋
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Venue Popup (Snapchat style) */}
      {selectedVenue && (
        <div className="absolute bottom-4 left-4 right-4 z-40 animate-fade-in">
          <div className="bg-black bg-opacity-90 backdrop-blur-lg rounded-2xl p-4 max-w-sm mx-auto border border-gray-700">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: getVenueTypeColor(selectedVenue.venueType) }}
                >
                  {(() => {
                    const VenueIcon = getVenueTypeIcon(selectedVenue.venueType);
                    return <VenueIcon className="text-white w-5 h-5" />;
                  })()}
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg" data-testid={`popup-venue-name-${selectedVenue.id}`}>
                    {selectedVenue.name}
                  </h3>
                  <p className="text-gray-400 text-sm" data-testid={`popup-venue-address-${selectedVenue.id}`}>
                    {selectedVenue.district}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedVenue(null)}
                className="text-gray-400 hover:text-white text-xl"
                data-testid="popup-close"
              >
                ×
              </button>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white font-medium" data-testid={`popup-visitors-${selectedVenue.id}`}>
                    {selectedVenue.currentVisitors} people here now
                  </span>
                </div>
                <span className="text-gray-400 text-sm capitalize">{selectedVenue.venueType}</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button 
                onClick={() => onVenueClick(selectedVenue.id)}
                className="flex-1 bg-white text-black py-2.5 px-4 rounded-xl font-bold"
                data-testid={`popup-view-details-${selectedVenue.id}`}
              >
                View Details
              </button>
              <button className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl">
                🔥
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}