import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import MapView, { Marker, Region, LatLng } from 'react-native-maps';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { MapPin, Users, Navigation, ZoomIn, ZoomOut, Coffee, Music, Utensils, Wine } from 'lucide-react-native';

type MapVenue = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  crowdDensity: 'high' | 'medium' | 'low';
  genderRatio: {
    male: number;
    female: number;
  };
  currentVisitors: number;
  features?: string[];
  isOpen: boolean;
};

interface InteractiveMapProps {
  venues: MapVenue[];
  onVenueClick: (venueId: string) => void;
  userLocation?: { lat: number; lng: number } | null;
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

export function InteractiveMap({ venues, onVenueClick, userLocation = null }: InteractiveMapProps) {
  const mapRef = useRef<MapView>(null);
  const [selectedVenue, setSelectedVenue] = useState<MapVenue | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserOnMap | null>(null);
  const [region, setRegion] = useState<Region>({
    latitude: 41.0082, // Istanbul center
    longitude: 28.9784,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
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
    // Add more mock users as needed
  ];

  // Add coordinates to venues if not already present
  const venuesWithCoords = venues.map((venue, index) => {
    if (venue.lat && venue.lng) return venue;
    
    // Generate consistent positions based on venue ID
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

  const handleZoomIn = () => {
    mapRef.current?.animateToRegion({
      ...region,
      latitudeDelta: region.latitudeDelta / 2,
      longitudeDelta: region.longitudeDelta / 2,
    });
  };

  const handleZoomOut = () => {
    mapRef.current?.animateToRegion({
      ...region,
      latitudeDelta: region.latitudeDelta * 2,
      longitudeDelta: region.longitudeDelta * 2,
    });
  };

  const handleRegionChangeComplete = (newRegion: Region) => {
    setRegion(newRegion);
  };

  const centerOnUser = () => {
    if (userLocation) {
      mapRef.current?.animateToRegion({
        latitude: userLocation.lat,
        longitude: userLocation.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  const getVenueColor = (density: 'high' | 'medium' | 'low') => {
    switch (density) {
      case 'high': return '#EC4899'; // pink-500
      case 'medium': return '#F59E0B'; // yellow-500
      case 'low':
      default:
        return '#10B981'; // green-500
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={handleRegionChangeComplete}
        showsUserLocation={!!userLocation}
        showsMyLocationButton={false}
        showsCompass={false}
      >
        {/* Venue Markers */}
        {venuesWithCoords.map((venue) => (
          <Marker
            key={`venue-${venue.id}`}
            coordinate={{
              latitude: venue.lat,
              longitude: venue.lng,
            }}
            onPress={() => setSelectedVenue(venue === selectedVenue ? null : venue)}
          >
            <View style={[styles.venueMarker, { backgroundColor: getVenueColor(venue.crowdDensity) }]}>
              <Users size={16} color="white" />
            </View>
          </Marker>
        ))}

        {/* User Markers */}
        {usersOnMap.map((user) => (
          <Marker
            key={`user-${user.id}`}
            coordinate={{
              latitude: user.lat,
              longitude: user.lng,
            }}
            onPress={() => setSelectedUser(user === selectedUser ? null : user)}
          >
            <View style={styles.userMarker}>
              <Image 
                source={{ uri: user.avatar }} 
                style={styles.avatar} 
              />
              {user.isOnline && <View style={styles.onlineIndicator} />}
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Map Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={centerOnUser}>
          <Navigation size={20} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.zoomControls}>
          <TouchableOpacity style={styles.zoomButton} onPress={handleZoomIn}>
            <ZoomIn size={20} color="#1F2937" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.zoomButton} onPress={handleZoomOut}>
            <ZoomOut size={20} color="#1F2937" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Venue Info Card */}
      {selectedVenue && (
        <View style={styles.infoCard}>
          <Text style={styles.venueName}>{selectedVenue.name}</Text>
          <View style={styles.venueDetails}>
            <View style={styles.detailRow}>
              <Users size={16} color="#6B7280" />
              <Text style={styles.detailText}>
                {selectedVenue.currentVisitors} people here
              </Text>
            </View>
            <View style={styles.detailRow}>
              <View style={[styles.statusDot, selectedVenue.isOpen ? styles.openDot : styles.closedDot]} />
              <Text style={styles.detailText}>
                {selectedVenue.isOpen ? 'Open Now' : 'Closed'}
              </Text>
            </View>
          </View>
          <Button 
            variant="default" 
            size="sm" 
            onPress={() => onVenueClick(selectedVenue.id)}
            style={styles.viewButton}
          >
            View Venue
          </Button>
        </View>
      )}
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  controls: {
    position: 'absolute',
    right: 16,
    top: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  controlButton: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomControls: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  zoomButton: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  venueMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EC4899',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  userMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  onlineIndicator: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: 'white',
  },
  infoCard: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  venueName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#111827',
  },
  venueDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    marginLeft: 8,
    color: '#4B5563',
    fontSize: 14,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  openDot: {
    backgroundColor: '#10B981',
  },
  closedDot: {
    backgroundColor: '#EF4444',
  },
  viewButton: {
    width: '100%',
  },
});
