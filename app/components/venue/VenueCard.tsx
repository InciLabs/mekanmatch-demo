import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { Badge } from '@components/ui/Badge';
import { CrowdBar } from '@components/venue/CrowdBar';

type VenueWithStats = {
  id: string;
  name: string;
  imageUrl?: string;
  distance?: number;
  district: string;
  crowdDensity: 'high' | 'medium' | 'low';
  genderRatio: {
    male: number;
    female: number;
  };
  currentVisitors: number;
  features?: string[];
  isOpen: boolean;
};

interface VenueCardProps {
  venue: VenueWithStats;
  onPress: () => void;
}

export function VenueCard({ venue, onPress }: VenueCardProps) {
  const densityColor = venue.crowdDensity === 'high' ? 'bg-pink-500' : 
                      venue.crowdDensity === 'medium' ? 'bg-yellow-500' : 'bg-green-500';
  
  const densityText = venue.crowdDensity.toUpperCase();

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image 
        source={{ uri: venue.imageUrl || "https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200" }} 
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{venue.name}</Text>
            <View style={styles.location}>
              <MapPin size={12} color="#9CA3AF" />
              <Text style={styles.distance}>
                {venue.distance ? `${venue.distance.toFixed(1)} km • ` : ''}{venue.district}
              </Text>
            </View>
          </View>
          <Badge variant="default" className={densityColor}>
            {densityText}
          </Badge>
        </View>

        <CrowdBar 
          malePercentage={venue.genderRatio.male}
          femalePercentage={venue.genderRatio.female}
          totalPeople={venue.currentVisitors}
        />

        <View style={styles.footer}>
          <View style={styles.features}>
            {venue.features?.slice(0, 2).map((feature, index) => (
              <View key={index} style={styles.feature}>
                <Text style={styles.featureText}>
                  {getFeatureIcon(feature)} {formatFeature(feature)}
                </Text>
              </View>
            ))}
          </View>
          <Text style={[
            styles.status, 
            venue.isOpen ? styles.openStatus : styles.closedStatus
          ]}>
            {venue.isOpen ? 'Open' : 'Closed'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function getFeatureIcon(feature: string): string {
  const icons: Record<string, string> = {
    'cocktails': '🍸',
    'dancing': '💃',
    'rooftop': '🌃',
    'live-music': '🎵',
    'craft-beer': '🍻',
    'karaoke': '🎤',
    'underground': '🌊',
    'casual': '😎',
  };
  return icons[feature] || '🎉';
}

function formatFeature(feature: string): string {
  return feature.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1F2937', // bg-gray-800
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#8B5CF6', // border-l-neon-purple
  },
  image: {
    width: '100%',
    height: 160,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
    fontFamily: 'Poppins_600SemiBold',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distance: {
    fontSize: 12,
    color: '#9CA3AF', // text-gray-400
    marginLeft: 4,
    fontFamily: 'OpenSans_400Regular',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  feature: {
    marginRight: 12,
  },
  featureText: {
    fontSize: 12,
    color: '#9CA3AF', // text-gray-400
    fontFamily: 'OpenSans_400Regular',
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'OpenSans_600SemiBold',
  },
  openStatus: {
    color: '#8B5CF6', // text-neon-purple
  },
  closedStatus: {
    color: '#F87171', // text-red-400
  },
});
