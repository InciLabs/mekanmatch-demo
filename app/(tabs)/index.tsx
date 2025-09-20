import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Mock data - gerçek uygulamada API'den gelecek
const mockVenues = [
  {
    id: 'venue-1',
    name: '360 Istanbul',
    address: 'Istiklal Caddesi No:163, Beyoğlu',
    district: 'Beyoğlu',
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
    venueType: 'rooftop',
    priceRange: 3,
    currentVisitors: 180,
    genderRatio: { male: 60, female: 40 },
    crowdDensity: 'high' as const,
    isOpen: true,
  },
  {
    id: 'venue-2',
    name: 'Klein',
    address: 'Kadıköy Merkez',
    district: 'Kadıköy',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
    venueType: 'club',
    priceRange: 2,
    currentVisitors: 120,
    genderRatio: { male: 55, female: 45 },
    crowdDensity: 'medium' as const,
    isOpen: true,
  },
  {
    id: 'venue-3',
    name: 'Arkaoda',
    address: 'Cihangir',
    district: 'Cihangir',
    imageUrl: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
    venueType: 'bar',
    priceRange: 2,
    currentVisitors: 80,
    genderRatio: { male: 50, female: 50 },
    crowdDensity: 'low' as const,
    isOpen: true,
  },
];

export default function HomeScreen() {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleVenueClick = (venueId: string) => {
    router.push({ pathname: '/venue/[id]', params: { id: venueId } } as any);
  };

  const renderVenueCard = (venue: any) => (
    <TouchableOpacity
      key={venue.id}
      style={styles.venueCard}
      onPress={() => handleVenueClick(venue.id)}
    >
      <View style={styles.venueImageContainer}>
        <View style={styles.venueImagePlaceholder}>
          <Ionicons name="location" size={40} color="#8B5CF6" />
        </View>
        <View style={styles.crowdIndicator}>
          <View style={[
            styles.crowdDot,
            { backgroundColor: venue.crowdDensity === 'high' ? '#EF4444' : venue.crowdDensity === 'medium' ? '#F59E0B' : '#10B981' }
          ]} />
        </View>
      </View>
      
      <View style={styles.venueInfo}>
        <Text style={styles.venueName}>{venue.name}</Text>
        <Text style={styles.venueAddress}>{venue.address}</Text>
        <Text style={styles.venueDistrict}>{venue.district}</Text>
        
        <View style={styles.venueStats}>
          <View style={styles.statItem}>
            <Ionicons name="people" size={16} color="#9CA3AF" />
            <Text style={styles.statText}>{venue.currentVisitors}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="male-female" size={16} color="#9CA3AF" />
            <Text style={styles.statText}>{venue.genderRatio.male}%M/{venue.genderRatio.female}%F</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.appTitle}>MekanMatch</Text>
            <Text style={styles.locationText}>İstanbul, Turkey</Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="search" size={20} color="#9CA3AF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="filter" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* View Toggle */}
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'map' && styles.toggleButtonActive]}
            onPress={() => setViewMode('map')}
          >
            <Ionicons name="map" size={16} color={viewMode === 'map' ? '#FFFFFF' : '#9CA3AF'} />
            <Text style={[styles.toggleText, viewMode === 'map' && styles.toggleTextActive]}>
              Map View
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'list' && styles.toggleButtonActive]}
            onPress={() => setViewMode('list')}
          >
            <Ionicons name="list" size={16} color={viewMode === 'list' ? '#FFFFFF' : '#9CA3AF'} />
            <Text style={[styles.toggleText, viewMode === 'list' && styles.toggleTextActive]}>
              List View
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {viewMode === 'map' ? (
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map" size={60} color="#374151" />
          <Text style={styles.mapPlaceholderText}>Map View</Text>
          <Text style={styles.mapPlaceholderSubtext}>Interactive map will be implemented here</Text>
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Trending Banner */}
          <View style={styles.trendingBanner}>
            <Ionicons name="flame" size={24} color="#EC4899" />
            <View style={styles.trendingText}>
              <Text style={styles.trendingTitle}>Where's busy tonight?</Text>
              <Text style={styles.trendingSubtitle}>Kadıköy & Beyoğlu are buzzing!</Text>
            </View>
          </View>

          {/* Venue Cards */}
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#8B5CF6" />
            </View>
          ) : (
            <View style={styles.venuesContainer}>
              {mockVenues.map(renderVenueCard)}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937',
  },
  header: {
    backgroundColor: '#111827',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#D1D5DB',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#374151',
    borderWidth: 1,
    borderColor: '#4B5563',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  toggleButtonActive: {
    backgroundColor: '#8B5CF6',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#374151',
    margin: 24,
    borderRadius: 12,
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#D1D5DB',
    marginTop: 12,
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  trendingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 24,
    marginVertical: 16,
  },
  trendingText: {
    marginLeft: 12,
  },
  trendingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  trendingSubtitle: {
    fontSize: 14,
    color: '#D1D5DB',
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  venuesContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  venueCard: {
    backgroundColor: '#374151',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  venueImageContainer: {
    position: 'relative',
    height: 120,
    backgroundColor: '#4B5563',
  },
  venueImagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crowdIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  crowdDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  venueInfo: {
    padding: 16,
  },
  venueName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  venueAddress: {
    fontSize: 14,
    color: '#D1D5DB',
    marginBottom: 2,
  },
  venueDistrict: {
    fontSize: 12,
    color: '#8B5CF6',
    marginBottom: 12,
  },
  venueStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
