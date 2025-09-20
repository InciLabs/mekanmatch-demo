import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, ImageBackground, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Components
import { Button } from './components/ui';
// Remove CrowdBar import as it's not available

// Hooks
import { useAppState } from './hooks/use-app-state';

// Types
import type { VenueWithStats } from './lib/types/schema';

// Extended types for venue details
interface MenuItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  category: string;
}

interface Event {
  id: string;
  name: string;
  date: string;
  startTime: string;
  description: string;
  imageUrl: string;
}

// Type guard to check if openingHours is a string
const isOpeningHoursString = (hours: any): hours is string => {
  return typeof hours === 'string';
};

const { width } = Dimensions.get('window');

export default function VenueDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { currentUser } = useAppState();

  const venueId = id || '';

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

  const venue = venues.find(v => v.id === venueId) as VenueWithStats | undefined;

  const handleBack = () => {
    router.back();
  };

  const handleCheckin = () => {
    if (!currentUser) {
      router.push('/auth/login' as any);
      return;
    }
    if (venue) {
      router.push({
        pathname: '/(tabs)/checkin',
        params: { venueId: venue.id }
      } as any);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${venue?.name} on MekanMatch!`,
        url: `https://mekanmatch.app/venue/${venueId}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const canCheckIn = currentUser?.subscriptionType !== 'free';

  if (!venue) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Venue not found</Text>
        <Button onPress={handleBack} style={styles.backButton}>
          <Text style={styles.buttonText}>Go Back</Text>
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Image */}
      <View style={styles.headerImageContainer}>
        <ImageBackground
          source={{ uri: venue.imageUrl || "https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" }}
          style={styles.headerImage}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.6)', 'transparent']}
            style={styles.gradient}
          />
          
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          {/* Share Button */}
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShare}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <Ionicons name="share-social" size={20} color="white" />
          </TouchableOpacity>

          {/* Venue Info Overlay */}
          <View style={styles.venueInfoOverlay}>
            <Text style={styles.venueName} numberOfLines={1}>
              {venue.name}
            </Text>
            <Text style={styles.venueAddress} numberOfLines={1}>
              {venue.address || 'No address provided'}
            </Text>
          </View>
        </ImageBackground>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Status Cards */}
        <View style={styles.statusCardsContainer}>
          <View style={styles.statusCard}>
            <Text style={styles.statusCardValue}>
              {venue.crowdDensity ? `${venue.crowdDensity}%` : 'N/A'}
            </Text>
            <Text style={styles.statusCardLabel}>Crowd Density</Text>
          </View>
          
          {venue.genderRatio && (
            <View style={styles.statusCard}>
              <Text style={[styles.statusCardValue, { color: '#8B5CF6' }]}>
                {venue.genderRatio.male}/{venue.genderRatio.female}
              </Text>
              <Text style={styles.statusCardLabel}>M/F Ratio</Text>
            </View>
          )}
        </View>

        {/* Visual Crowd Bar */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Live Crowd Analytics</Text>
            <Text style={styles.updatedText}>Updated 2 min ago</Text>
          </View>
          
          <View style={styles.crowdBarContainer}>
            <View style={[styles.crowdBar, { width: `${venue.crowdDensity || 50}%` }]} />
            <Text style={styles.crowdText}>
              {venue.currentVisitors} people currently here
            </Text>
          </View>

          {/* Age Groups */}
          <View style={styles.ageGroupsContainer}>
            {[
              { percentage: '15%', range: '20-25' },
              { percentage: '30%', range: '25-30' },
              { percentage: '35%', range: '30-35' },
              { percentage: '20%', range: '35+' },
            ].map((item, index) => (
              <View key={index} style={styles.ageGroupItem}>
                <Text style={styles.ageGroupValue}>{item.percentage}</Text>
                <Text style={styles.ageGroupLabel}>{item.range}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Check-in Button */}
        <Button 
          onPress={handleCheckin}
          disabled={!canCheckIn}
          style={[styles.checkinButton, !canCheckIn && styles.checkinButtonDisabled]}
        >
          <Text style={styles.checkinButtonText}>
            {canCheckIn ? 'Check-in Now' : 'Upgrade to Check-in'}
          </Text>
        </Button>

        {/* About Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>
            {venue.description || 'No description available.'}
          </Text>
          
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={20} color="#9CA3AF" />
            <Text style={styles.detailText}>Open until 2:00 AM</Text>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.crowdBarContainer}>
              <View style={[styles.crowdBar, { width: `${venue.currentVisitors}%` }]} />
            </View>
            <Text style={styles.crowdText}>
              {venue.currentVisitors > 70 ? 'Very Busy' : 
               venue.currentVisitors > 40 ? 'Moderately Busy' : 'Not Busy'}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="pricetag-outline" size={20} color="#9CA3AF" />
            <Text style={styles.detailText}>
              {venue.priceRange === 1 ? '₺' : venue.priceRange === 2 ? '₺₺' : '₺₺₺'}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="musical-notes-outline" size={20} color="#9CA3AF" />
            <Text style={styles.detailText}>{venue.musicType || 'Various'}</Text>
          </View>
        </View>

        {/* Upcoming Events */}
        {events.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            {events.map(event => (
              <View key={event.id} style={styles.eventItem}>
                <View style={styles.eventDate}>
                  <Text style={styles.eventDay}>{new Date(event.startTime).getDate()}</Text>
                  <Text style={styles.eventMonth}>
                    {new Date(event.startTime).toLocaleString('default', { month: 'short' })}
                  </Text>
                </View>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{event.name}</Text>
                  <Text style={styles.eventTime}>
                    {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </View>
            ))}
          </View>
        )}

        {/* Menu Preview */}
        {menu.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Popular Items</Text>
            {menu.slice(0, 3).map((item, index) => (
              <View key={item.id} style={styles.menuItem}>
                <View style={styles.menuItemInfo}>
                  <Text style={styles.menuItemName}>{item.name}</Text>
                  <Text style={styles.menuItemDescription} numberOfLines={1}>
                    {item.description}
                  </Text>
                  <Text style={styles.menuItemPrice}>₺{item.price.toFixed(2)}</Text>
                </View>
                <View style={styles.menuItemImage}>
                  <Ionicons name="fast-food-outline" size={24} color="#9CA3AF" />
                </View>
              </View>
            ))}
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View Full Menu</Text>
              <Ionicons name="chevron-forward" size={16} color="#8B5CF6" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  crowdBarContainer: {
    height: 24,
    backgroundColor: '#e9ecef',
    borderRadius: 12,
    marginVertical: 10,
    overflow: 'hidden',
  },
  crowdBar: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
  },
  crowdText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    color: 'white',
    fontWeight: '600',
    lineHeight: 24,
  },
  notFoundContainer: {
    flex: 1,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundText: {
    color: '#9CA3AF',
    fontSize: 18,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  headerImageContainer: {
    height: 256,
    width: '100%',
    position: 'relative',
  },
  headerImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  shareButton: {
    position: 'absolute',
    top: 50,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  venueInfoOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  venueName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  venueAddress: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  content: {
    padding: 16,
  },
  statusCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statusCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
  },
  statusCardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EC4899', // electric-pink
    marginBottom: 4,
  },
  statusCardLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  card: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  updatedText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  ageGroupsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  ageGroupItem: {
    alignItems: 'center',
  },
  ageGroupValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B5CF6', // neon-purple
    marginBottom: 2,
  },
  ageGroupLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  checkinButton: {
    backgroundColor: '#8B5CF6', // neon-purple
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  checkinButtonDisabled: {
    backgroundColor: '#4B5563', // gray-600
  },
  checkinButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 12,
  },
  aboutText: {
    color: '#D1D5DB',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    color: '#D1D5DB',
    marginLeft: 8,
    fontSize: 14,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  eventDate: {
    width: 50,
    height: 50,
    backgroundColor: '#374151',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  eventDay: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  eventMonth: {
    fontSize: 12,
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    color: 'white',
    fontWeight: '500',
    marginBottom: 2,
  },
  eventTime: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  menuItemInfo: {
    flex: 1,
    marginRight: 12,
  },
  menuItemName: {
    color: 'white',
    fontWeight: '500',
    marginBottom: 4,
  },
  menuItemDescription: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 4,
  },
  menuItemPrice: {
    color: '#8B5CF6',
    fontWeight: '600',
  },
  menuItemImage: {
    width: 60,
    height: 60,
    backgroundColor: '#374151',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  viewAllText: {
    color: '#8B5CF6',
    fontWeight: '500',
    marginRight: 4,
  },
});
